import { Test, TestingModule } from '@nestjs/testing';
import { 
  HttpModule,
} from '@nestjs/common';
import { Check } from './classes/check.class';
import { Payment } from './classes/payment.class';
import { PaymentError } from './classes/payment-error.class';
import { DatabaseService } from '../database/database.service';
import { PaymentService } from './payment.service';
import OracleDB from 'oracledb';

describe('PaymentService', () => {
  const MSISDN = '111111111111111';
  let service: PaymentService;
  let paymentStatus = 1;

  const databaseService = {
    getByQuery: () => { 
      return {
        outBinds: {
          status: paymentStatus, 
          balance: 120,
        }
      };
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PaymentService, DatabaseService],
    })
      .overrideProvider(DatabaseService)
      .useValue(databaseService)
      .compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send request to check module', async () => {
    const resolutionMock = {
      status: true,
      account: 1,
    };
    const request = jest
      .spyOn(service, 'checkRequest')
      .mockResolvedValue(new Check(MSISDN, true, 1, 'text message'));

    await service.getResolution(MSISDN);

    expect(request).toHaveBeenCalled();
  });

  it('should return check resolution', async () => {
    const check = new Check(MSISDN, true, 1, 'success');
    const resolutionMock = {
      status: true,
      account: 1,
    };
    const request = jest.spyOn(service, 'checkRequest').mockResolvedValue(resolutionMock);

    const resolution = await service.getResolution(MSISDN);

    expect(resolution).toEqual(check);
  });

  it('should return account closed error', async () => {
    const resolutionMock = {
      status: false,
      account: 1,
    };
    const request = jest.spyOn(service, 'checkRequest').mockResolvedValue(resolutionMock);

    const resolution = await service.getResolution(MSISDN);

    expect(resolution).toEqual(new PaymentError(10, 'Account is closed'));
  });

  it('should return undefined msisdn error', async () => {
    const rejectedValue = {code: 1, message: `MSISDN [${MSISDN}] not found.`}
    const request = jest
      .spyOn(service, 'checkRequest')
      .mockRejectedValue(rejectedValue);

    const resolution = await service.getResolution(MSISDN);

    expect(resolution).toEqual(new PaymentError(rejectedValue.code, rejectedValue.message));
  });

  it('should add payment to customer', async () => {
    const payment = new Payment(MSISDN, new Date().toISOString(), 10, "1", 120);

    expect(await service.addPayment(1, payment)).toEqual(payment);
  });

  it('should reject payment to customer couse of balance', async () => {
    paymentStatus = 2;
    const payment = new Payment(MSISDN, new Date().toISOString(), 10, "1", 120);

    expect(await service.addPayment(1, payment)).toBeInstanceOf(PaymentError);
  });
});
