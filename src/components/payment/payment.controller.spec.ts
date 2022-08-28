import { mockUser } from '../user/test';
import { Test, TestingModule } from '@nestjs/testing';
import { PayTicketDto } from './dto';
import { PaymentServiceInterface } from './interface';
import { PaymentController } from './payment.controller';
import { mockPaymentTicket, mockPayTicket, PaymentServiceSpy } from './test';
import { PaymentStatus } from './schemas';

type SutTypes = {
  sut: PaymentController;
  paymentServiceSPy: PaymentServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      PaymentController,
      {
        provide: 'PaymentServiceInterface',
        useClass: PaymentServiceSpy,
      },
    ],
  }).compile();

  const sut = module.get<PaymentController>(PaymentController);
  const paymentServiceSPy = module.get<PaymentServiceInterface>(
    'PaymentServiceInterface',
  ) as PaymentServiceSpy;

  return { sut, paymentServiceSPy };
};

describe('PaymentController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should call the payment ticket function with success which is received through the endpoint', async () => {
    const { sut, paymentServiceSPy } = await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    jest
      .spyOn(paymentServiceSPy, 'hasBeenPaid')
      .mockImplementationOnce((): any => null);

    const response = await sut.payTicket(payload, { userId: mockedUser._id });

    expect(paymentServiceSPy.callsCount).toBe(1);
    expect(paymentServiceSPy.payload).toBe(payload);
    expect(response).toHaveProperty('_id');
  });

  it('should call the payment ticket function with error', async () => {
    const { sut } = await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    await expect(async () => {
      await sut.payTicket(payload, { userId: mockedUser._id });
    }).rejects.toThrowError(`Ticket ${payload.billet} has already been paid.`);
  });

  it('should call the payment ticket function with error', async () => {
    const { sut, paymentServiceSPy } = await makeSut();

    const mockedPayment = mockPayTicket();
    const mockedUser = mockUser();

    const payload: PayTicketDto = {
      billet: mockedPayment.billet,
      amount: mockedPayment.amount,
    };

    jest
      .spyOn(paymentServiceSPy, 'hasBeenPaid')
      .mockImplementationOnce((): any => {
        return { ...mockPaymentTicket(), status: PaymentStatus.PENDING };
      });

    await expect(async () => {
      await sut.payTicket(payload, { userId: mockedUser._id });
    }).rejects.toThrowError(
      `Ticket ${payload.billet} is still being processed.`,
    );
  });
});
