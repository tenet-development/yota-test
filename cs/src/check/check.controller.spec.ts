import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { Check } from './check.class';
import { CheckController } from './check.controller';
import { DatabaseService } from '../database/database.service';
import { CheckService } from './check.service'

describe('Check Controller', () => {
  let controller: CheckController;

  const MSISDN = '111111111111';
  const body = {
    msisdn: MSISDN,
  };

  let check = new Check(MSISDN, true, 1);
  const checkService = {
    check: () => Promise.resolve(check)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckService, DatabaseService],
      controllers: [CheckController],
    })
      .overrideProvider(CheckService)
      .useValue(checkService)
      .compile();

    controller = module.get<CheckController>(CheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return correct resolution', async () => {
    expect(await controller.check(body, {})).toEqual({
      account: 1, 
      status: true,
    })
  });

  it('should throw not found exception', async () => {
    check = null;

    await expect(controller.check(body, {})).rejects.toThrow(NotFoundException);
  });
});
