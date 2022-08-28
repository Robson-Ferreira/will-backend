import { Test, TestingModule } from '@nestjs/testing';
import { RemotePaymentService } from './remote-payment.service';

type SutTypes = {
  sut: RemotePaymentService;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [RemotePaymentService],
  }).compile();

  const sut = module.get<RemotePaymentService>(RemotePaymentService);

  return { sut };
};

describe('RemotePaymentService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });
});
