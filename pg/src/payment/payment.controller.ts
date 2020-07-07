import { 
  Controller, 
  HttpStatus, 
  Post, 
  Get, 
  HttpCode, 
  InternalServerErrorException, 
  Body 
} from '@nestjs/common';
import { Payment } from './classes/payment.class';
import { PaymentError } from './classes/payment-error.class';
import { PaymentService } from './payment.service';
import { 
  ApiBody, 
  ApiOkResponse, 
  ApiInternalServerErrorResponse 
} from '@nestjs/swagger';

export type paymentType = {msisdn: string, operation: string, sum: number, date: string };

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: [Payment] })
  @ApiOkResponse({ description: 'Successfully.'})
  @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
  async check(
    @Body() body: paymentType,
  ): Promise<{ code: number, message?: string, operation?: string, balance?: number }> {
    const result = await this.service.payment(body);

    if (result instanceof PaymentError) {
      return {
        code: result.code,
        message: result.message
      };
    }

    return {
      code: 0,
      operation: result.operation,
      balance: result.balance
    };
  }
}
