import { CreateCashBackDto } from '../dto';
import { CashBackServiceInterface } from '../interface';
import { CashBackEntity } from '../schemas';
import { mockCashBack } from './mock-cash-back.entity';

export class CashBackServiceSpy implements CashBackServiceInterface {
  callsCount = 0;
  payload: any = null;

  getCashBackByValue(): Promise<CashBackEntity> {
    throw new Error('Method not implemented.');
  }

  createCashBackRule(payload: CreateCashBackDto): Promise<CashBackEntity> {
    this.payload = payload;
    this.callsCount++;
    return Promise.resolve(mockCashBack());
  }
}

export const mockCreateCashBackDto = (): CreateCashBackDto =>
  ({
    from: 1000,
    to: 5000,
    percentage: 2,
    active: true,
  } as CreateCashBackDto);
