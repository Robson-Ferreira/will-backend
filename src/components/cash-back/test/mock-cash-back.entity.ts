import { CashBackEntity } from '../schemas';

export class MockCashBackModel {
  save = jest.fn().mockResolvedValue(() => {
    return { a: 'test', toJSON: () => mockCashBack() };
  });

  static findOne = () => {
    return {
      lean: () => mockCashBack(),
    };
  };

  static findById = () => {
    return {
      lean: () => mockCashBack(),
    };
  };

  static findOneAndUpdate = () => {
    return {
      lean: () => mockCashBack(),
    };
  };

  static create = () => mockCashBack();

  static find = () => [mockCashBack()];

  static countDocuments = jest.fn().mockResolvedValue(1);
}

export const mockCashBack = (): CashBackEntity =>
  ({
    _id: '630848ac1fe74d083c5cc606',
    from: 1000,
    to: 5000,
    percentage: 2,
    active: true,
  } as CashBackEntity);
