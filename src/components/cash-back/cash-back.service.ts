import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCashBackDto } from './dto';
import { CashBackServiceInterface } from './interface';
import { CashBackDocument, CashBackEntity } from './schemas';

export class CashBackService implements CashBackServiceInterface {
  constructor(
    @InjectModel(CashBackEntity.name)
    private readonly CashBackModel: Model<CashBackDocument>,
  ) {}

  async getCashBackByValue(value: number): Promise<CashBackEntity> {
    const cashBacks = await this.CashBackModel.find({ active: true });

    return cashBacks.find((cash) => value >= cash.from && value <= cash.to);
  }

  async createCashBackRule(
    payload: CreateCashBackDto,
  ): Promise<CashBackEntity> {
    return this.CashBackModel.create(payload);
  }
}
