import { RemoteResponsePaymentService } from './remote-response-payment.service.interface';

export interface RemotePaymentServiceInterface {
  pay(data: any): Promise<RemoteResponsePaymentService>;
}
