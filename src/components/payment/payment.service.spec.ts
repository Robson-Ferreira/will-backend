import { CashBackServiceSpy } from '../cash-back/test';
import { mockUser, UserServiceSpy } from '../user/test';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PayTicketDto } from './dto';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './schemas';
import {
  MockPaymentModel,
  mockPayTicket,
  PaymentProcessServiceSpy,
  RemotePaymentServiceSpy,
} from './test';
import {
  PaymentProcessServiceInterface,
  RemotePaymentServiceInterface,
} from './interface';

type SutTypes = {
  sut: PaymentService;
  paymentProcessService: PaymentProcessServiceSpy;
  remotePaymentService: RemotePaymentServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentService,
      {
        provide: getModelToken(PaymentEntity.name),
        useValue: MockPaymentModel,
      },
      {
        provide: 'RemotePaymentServiceInterface',
        useClass: RemotePaymentServiceSpy,
      },
      {
        provide: 'CashBackServiceInterface',
        useClass: CashBackServiceSpy,
      },
      {
        provide: 'UserServiceInterface',
        useClass: UserServiceSpy,
      },
      {
        provide: 'PaymentProcessServiceInterface',
        useClass: PaymentProcessServiceSpy,
      },
      {
        provide: 'MetricsServiceInterface',
        useClass: jest.fn(),
      },
    ],
  }).compile();

  const sut = module.get<PaymentService>(PaymentService);
  const paymentProcessService = module.get<PaymentProcessServiceInterface>(
    'PaymentProcessServiceInterface',
  ) as PaymentProcessServiceSpy;
  const remotePaymentService = module.get<RemotePaymentServiceInterface>(
    'RemotePaymentServiceInterface',
  ) as RemotePaymentServiceSpy;

  return { sut, paymentProcessService, remotePaymentService };
};

describe('PaymentService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should be pay an ticket successfully', async () => {
    const { sut, paymentProcessService } = await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    const response = await sut.payTicket(payload, mockedUser._id);

    expect(response).toHaveProperty('_id');
    expect(response).toHaveProperty('paymentDate');
    expect(paymentProcessService.callsCount).toBe(1);
  });

  it('should be pay an ticket with error', async () => {
    const { sut, remotePaymentService, paymentProcessService } =
      await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    jest.spyOn(remotePaymentService, 'pay').mockImplementationOnce((): any => {
      throw new Error('mock test error');
    });

    expect(async () => {
      await sut.payTicket(payload, mockedUser._id);
    }).rejects.toThrowError('mock test error');
    expect(paymentProcessService.callsCount).toBe(1);
  });
});
