import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PaymentModule,
    ConfigModule.forRoot()
  ],
})
export class AppModule {}
