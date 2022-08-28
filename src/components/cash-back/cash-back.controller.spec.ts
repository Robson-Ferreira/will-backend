import { Test, TestingModule } from '@nestjs/testing';
import { CashBackController } from './cash-back.controller';
import { CashBackServiceInterface } from './interface';
import { CashBackServiceSpy, mockCreateCashBackDto } from './test';

type SutTypes = {
  sut: CashBackController;
  cashBackService: CashBackServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CashBackController,
      {
        provide: 'CashBackServiceInterface',
        useClass: CashBackServiceSpy,
      },
    ],
  }).compile();

  const sut = module.get<CashBackController>(CashBackController);
  const cashBackService = module.get<CashBackServiceInterface>(
    'CashBackServiceInterface',
  ) as CashBackServiceSpy;

  return { sut, cashBackService };
};

describe('CashBackController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should call the create cash back function which is received through the endpoint', async () => {
    const { sut, cashBackService } = await makeSut();

    const payload = mockCreateCashBackDto();

    const response = await sut.createCashBack(payload);

    expect(response).toHaveProperty('_id');
    expect(cashBackService.callsCount).toBe(1);
    expect(cashBackService.payload).toBe(payload);
  });
});
