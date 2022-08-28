import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CashBackService } from './cash-back.service';
import { CreateCashBackDto } from './dto';
import { CashBackDocument, CashBackEntity } from './schemas';
import { mockCashBack, MockCashBackModel } from './test';

type SutTypes = {
  sut: CashBackService;
  CashBackModel: Model<CashBackDocument>;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CashBackService,
      {
        provide: getModelToken(CashBackEntity.name),
        useValue: MockCashBackModel,
      },
    ],
  }).compile();

  const sut = module.get<CashBackService>(CashBackService);
  const CashBackModel = module.get(getModelToken(CashBackEntity.name));

  return { sut, CashBackModel };
};

describe('CashBackService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should create new cash back rule successfully', async () => {
    const { sut } = await makeSut();

    const cashBackPayload = mockCashBack();
    delete cashBackPayload._id;

    const response = await sut.createCashBackRule(
      cashBackPayload as CreateCashBackDto,
    );

    expect(response).toHaveProperty('_id');
  });

  it('should get a cash back rule by value', async () => {
    const { sut } = await makeSut();

    const mockedCashBack = mockCashBack();

    const response = await sut.getCashBackByValue(mockedCashBack.from);

    expect(response).toStrictEqual(mockedCashBack);
    expect(response.from).toBe(mockedCashBack.from);
    expect(response.to).toBe(mockedCashBack.to);
  });
});
