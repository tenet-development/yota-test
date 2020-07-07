import { Injectable, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { Check } from './check.class';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class CheckService {
  constructor(private readonly database: DatabaseService) {}

  async getAccount(msisdn: string): Promise<number> {
    return await this.database.getByQuery<number>(
      `select ID from CUSTOMER where MSISDN = :msisdn`, 
      [msisdn]
    );
  }

  async getStatus(account: number): Promise<number> {
    return await this.database.getByQuery<number>(
      `select STATUS from CUSTOMER where ID = :id`, 
      [account]
    );
  }

  async check(
    data: { msisdn: string }, 
    customer_active?: string
  ): Promise<Check | null> {
    try {
      const account: number = await this.getAccount(data.msisdn);
      let status: number = 1;

      if (!account) return null;

      status = await this.getStatus(account);

      if ((status === 2) === (customer_active === 'true')) status = 1;

      return new Check(data.msisdn, status === 1, account);
    } catch (error) {
      console.error('Error happened:', error);
      throw new InternalServerErrorException({
        status: HttpStatus.BAD_REQUEST,
        error: error
      });
    }
  }
}
