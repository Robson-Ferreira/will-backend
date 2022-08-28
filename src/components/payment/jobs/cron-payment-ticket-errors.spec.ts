import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentEntity } from '../schemas';
import { MockPaymentModel } from '../test';
import { CronPaymentService } from './cron-payment-ticket-errors.service';

type SutTypes = {
  sut: CronPaymentService;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CronPaymentService,
      {
        provide: getModelToken(PaymentEntity.name),
        useValue: MockPaymentModel,
      },
      {
        provide: 'PaymentServiceInterface',
        useClass: jest.fn(),
      },
      {
        provide: 'UserServiceInterface',
        useClass: jest.fn(),
      },
    ],
  }).compile();

  const sut = module.get<CronPaymentService>(CronPaymentService);

  return { sut };
};

describe('CronPaymentService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });
});
