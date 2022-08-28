import { LeanDocument } from 'mongoose';
import { GetTransactionHistoryDto, PayTicketDto } from '../dto';
import { PaymentEntity } from '../schemas';

export interface PaymentServiceInterface {
  payTicket(
    payload: PayTicketDto,
    userId: string,
  ): Promise<LeanDocument<PaymentEntity>>;

  getTransactionHistory(
    userId: string,
    query: GetTransactionHistoryDto,
  ): Promise<any>;

  hasBeenPaid(billet: string): Promise<PaymentEntity>;
}
