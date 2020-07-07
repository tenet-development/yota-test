import { Module, HttpModule } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [HttpModule],
  providers: [PaymentService, DatabaseService],
  controllers: [PaymentController]
})
export class PaymentModule {}
