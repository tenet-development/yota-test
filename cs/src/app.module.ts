import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckModule } from './check/check.module';

@Module({
  imports: [
    CheckModule,
    ConfigModule.forRoot()
  ]
})
export class AppModule {}
