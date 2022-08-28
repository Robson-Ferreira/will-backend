import { LeanDocument } from 'mongoose';
import { PaymentEntity } from '../schemas';

export interface PaymentProcessServiceInterface {
  registerPaymentTicketSuccess(
    userId: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>>;

  registerPaymentError(
    userId: string,
    errorMessage: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>>;
}
