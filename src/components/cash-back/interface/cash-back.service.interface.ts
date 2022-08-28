import { CreateCashBackDto } from '../dto';
import { CashBackEntity } from '../schemas';

export interface CashBackServiceInterface {
  getCashBackByValue(value: number): Promise<CashBackEntity>;

  createCashBackRule(payload: CreateCashBackDto): Promise<CashBackEntity>;
}
