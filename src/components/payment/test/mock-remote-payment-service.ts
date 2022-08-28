import {
  RemotePaymentServiceInterface,
  RemoteResponsePaymentService,
} from '../interface';

export class RemotePaymentServiceSpy implements RemotePaymentServiceInterface {
  callsCount = 0;
  data: any = null;

  pay(data: any): Promise<RemoteResponsePaymentService> {
    this.callsCount++;
    this.data = data;
    return Promise.resolve(remotePaymentPayload());
  }
}

export const remotePaymentPayload = () => ({
  transactionId: '416c203b-1842-4a10-baad-fbfab50de355',
});
