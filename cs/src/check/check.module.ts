import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [CheckService, DatabaseService],
  controllers: [CheckController]
})
export class CheckModule {}
