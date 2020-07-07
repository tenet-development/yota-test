import OracleDB from 'oracledb';
import { 
  Injectable, 
  HttpStatus, 
  HttpService,
  InternalServerErrorException
} from '@nestjs/common';
import { Payment } from './classes/payment.class';
import { Check } from './classes/check.class';
import { PaymentError } from './classes/payment-error.class';
import { DatabaseService } from '../database/database.service';
import { paymentType } from './payment.controller';

type checkType = { status: boolean, account: number };

@Injectable()
export class PaymentService {
  constructor(
      private httpService: HttpService,
      private readonly database: DatabaseService
  ) {}

  checkRequest(msisdn: string): Promise<checkType> {
    const { CHECK_MODULE_URL } = process.env;

    return new Promise((resolve, reject) => {
      this.httpService.post(`${CHECK_MODULE_URL}/check`, { "msisdn": msisdn })
        .subscribe(
          body => resolve(body.data),
          error => {
            if (error.response.status == 404) {
              reject({ code: 1, message: `MSISDN [${msisdn}] not found.`});
            } else {
              reject({ code: 3, message: `Internal error [${error.response.statusText}]"`});
            }
          }
        );
    });
  }

  async getResolution(msisdn: string): Promise<Check | PaymentError> {
    try {
      const { status, account }: checkType = await this.checkRequest(msisdn);

      if (!status) return new PaymentError(10, 'Account is closed');

      return new Check(msisdn, status, account, 'success');
    } catch (error) {
      return new PaymentError(error.code, error.message);
    }
  }

  async addPayment(
    account: number, 
    { msisdn, date, sum, operation }: paymentType
  ): Promise<Payment | PaymentError> {
    try {
      const result = await this.database.getByQuery<OracleDB.DBObject_OUT<{ balance: number, status: 1 | 2 }>>(
        `begin
          pg_package.add_payment(
            :customer,
            :external,
            to_date(:date, 'YYYY-MM-DD HH24:MI:SS'),
            :value,
            :balance,
            :status,
            :is_forced
          );
        end;`,
        {
          customer: { dir: OracleDB.BIND_IN, val: account, type: OracleDB.NUMBER },
          external: { dir: OracleDB.BIND_IN, val: operation, type: OracleDB.STRING },
          date: { dir: OracleDB.BIND_IN, val: `${date.substr(0, 10)} ${date.substr(11, 8)}`, type: OracleDB.STRING },
          value: { dir: OracleDB.BIND_IN, val: +sum, type: OracleDB.NUMBER },
          balance: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
          status: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
          is_forced: { dir: OracleDB.BIND_IN, val: 0, type: OracleDB.NUMBER }
        }
      );

      if (result.outBinds.status === 2) {
        return new PaymentError(
          result.outBinds.status,
          'insufficient funds'
        )
      }

      return new Payment(msisdn, date, sum, operation, result.outBinds.balance);
    } catch (error) {
      console.error('Error happened:', error);
    }
  }

  async payment(paymentData: paymentType): Promise<Payment | PaymentError> {
    try {
      const resolution: Check | PaymentError = await this.getResolution(paymentData.msisdn);

      if (resolution instanceof PaymentError) return resolution;

      return await this.addPayment(resolution.account, paymentData);
    } catch (error) {
      console.error('Error happened:', error);

      throw new InternalServerErrorException({
          status: HttpStatus.BAD_REQUEST,
          error: error
      });
    }
  }
}
