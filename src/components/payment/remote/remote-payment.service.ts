import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import {
  RemoteResponsePaymentService,
  RemotePaymentServiceInterface,
  RemoteRequestPaymentService,
} from '../interface';

export class RemotePaymentService implements RemotePaymentServiceInterface {
  private readonly httpService = new HttpService();

  async pay(
    data: RemoteRequestPaymentService,
  ): Promise<RemoteResponsePaymentService> {
    const { paymentProviderEndpoint, payloadToSend } = data;

    const { data: paymentResponse } = await lastValueFrom(
      this.httpService
        .post(paymentProviderEndpoint, payloadToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res)),
    );

    return JSON.parse(paymentResponse.replace(',', ''));
  }
}
