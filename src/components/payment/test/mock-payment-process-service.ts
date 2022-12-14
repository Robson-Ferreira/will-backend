import { LeanDocument } from 'mongoose';
import { PaymentProcessServiceInterface } from '../interface';
import { PaymentEntity } from '../schemas';
import { mockPaymentTicket } from './mock-payment.entity';

export class PaymentProcessServiceSpy
  implements PaymentProcessServiceInterface
{
  callsCount = 0;
  payload: any = null;

  registerPaymentTicketSuccess(
    userId: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>> {
    this.callsCount++;
    this.payload = { ...data, userId };

    return Promise.resolve(mockPaymentTicket());
  }

  registerPaymentError(userId: string, errorMessage: string, data: any): any {
    this.callsCount++;
    this.payload = { ...data, errorMessage, userId };

    return Promise.resolve({});
  }
}
