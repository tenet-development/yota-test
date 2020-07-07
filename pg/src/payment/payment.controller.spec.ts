import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Payment } from './classes/payment.class';
import { PaymentError } from './classes/payment-error.class';
import { DatabaseService } from '../database/database.service';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

describe('Payment Controller', () => {
  let controller: PaymentController;
  const requestBody = {
    msisdn: '111111111111',
    operation: "1",
    date: new Date().toISOString(),
    sum: 50
  };

  let payment: Payment | PaymentError = new Payment(
    requestBody.msisdn, 
    requestBody.date, 
    requestBody.sum,
    requestBody.operation,
    120
  );

  const paymentService = {
    payment: () => Promise.resolve(payment)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [PaymentService, DatabaseService],
      controllers: [PaymentController]
    })
      .overrideProvider(PaymentService)
      .useValue(paymentService)
      .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('response should contain success data', async () => {
    expect(await controller.check(requestBody)).toEqual({
      balance: 120,
      code: 0,
      operation: requestBody.operation,
    })
  });

  it('response should contain correct error message', async () => {
    const errorMessage = 'Some error happened'
    payment = new PaymentError(10, errorMessage);

    expect(await controller.check(requestBody)).toEqual({
      code: 10,
      message: errorMessage
    })
  });
});
