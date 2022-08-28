import { LeanDocument } from 'mongoose';
import { PayTicketDto, GetTransactionHistoryDto } from '../dto';
import { PaymentServiceInterface } from '../interface';
import { PaymentEntity } from '../schemas';
import { mockPaymentTicket } from './mock-payment.entity';

export class PaymentServiceSpy implements PaymentServiceInterface {
  callsCount = 0;
  payload: PayTicketDto = null;

  payTicket(
    payload: PayTicketDto,
    userId: string,
  ): Promise<LeanDocument<PaymentEntity>> {
    this.callsCount++;
    this.payload = payload;
    return Promise.resolve({ ...mockPayTicket(), userId }) as any;
  }

  getTransactionHistory(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  hasBeenPaid(): Promise<PaymentEntity> {
    this.callsCount++;
    return Promise.resolve(mockPaymentTicket());
  }
}

export const mockPayTicket = (): PayTicketDto =>
  ({
    _id: '630a8fa49899184a20507af4',
    campaign: 'CAMPAIGN01',
    billet: '82650000001132311699000900202215332047616454199',
    amount: '2000',
  } as PayTicketDto);
