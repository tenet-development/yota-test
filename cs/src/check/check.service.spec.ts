import { Test, TestingModule } from '@nestjs/testing';
import { Check } from './check.class';
import { CheckService } from './check.service';
import { DatabaseService } from '../database/database.service';

describe('CheckService', () => {
  let service: CheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckService, DatabaseService],
    }).compile();

    service = module.get<CheckService>(CheckService);
  });

  const MSISDN = '111111111111';
  const testData = { msisdn: MSISDN };

  let check = new Check(MSISDN, true, 1);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check with success status', async () => {
    jest.spyOn(service, 'getAccount').mockResolvedValue(1);
    jest.spyOn(service, 'getStatus').mockResolvedValue(1);

    expect(await service.check(testData)).toEqual(check);
  });

  it('should check with failure status', async () => {
    check = new Check(MSISDN, false, 1);

    jest.spyOn(service, 'getAccount').mockResolvedValue(1);
    jest.spyOn(service, 'getStatus').mockResolvedValue(2);

    expect(await service.check(testData)).toEqual(check);
  });

  it('should return succes couse of customer_active param is true', async () => {
    check = new Check(MSISDN, true, 1);

    jest.spyOn(service, 'getAccount').mockResolvedValue(1);
    jest.spyOn(service, 'getStatus').mockResolvedValue(2);

    expect(await service.check(testData, 'true')).toEqual(check);
  });

  it('should check with failure status', async () => {
    check = new Check(MSISDN, false, 1);

    jest.spyOn(service, 'getAccount').mockResolvedValue(1);
    jest.spyOn(service, 'getStatus').mockResolvedValue(2);

    expect(await service.check(testData)).toEqual(check);
  });

  it('should return null couse of account is null', async () => {
    jest.spyOn(service, 'getAccount').mockResolvedValue(null);
    jest.spyOn(service, 'getStatus').mockResolvedValue(2);

    expect(await service.check(testData)).toEqual(null);
  });

});
