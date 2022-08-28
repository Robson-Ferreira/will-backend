import { mockUser } from '@components/user/test';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PayTicketDto } from './dto';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './schemas';
import { MockPaymentModel, mockPayTicket } from './test';

type SutTypes = {
  sut: PaymentService;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentService,
      {
        provide: getModelToken(PaymentEntity.name),
        useValue: jest.fn(),
      },
      {
        provide: 'RemotePaymentServiceInterface',
        useClass: MockPaymentModel,
      },
      {
        provide: 'CashBackServiceInterface',
        useClass: jest.fn(),
      },
      {
        provide: 'UserServiceInterface',
        useClass: jest.fn(),
      },
      {
        provide: 'PaymentProcessServiceInterface',
        useClass: jest.fn(),
      },
      {
        provide: 'MetricsServiceInterface',
        useClass: jest.fn(),
      },
    ],
  }).compile();

  const sut = module.get<PaymentService>(PaymentService);

  return { sut };
};

describe('PaymentService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should be defined', async () => {
    const { sut } = await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    const response = await sut.payTicket(payload, mockedUser._id);
  });
});
