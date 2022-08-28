import { PaymentEntity, PaymentStatus, PaymentTypes } from '../schemas';

export class MockPaymentModel {
  save = jest.fn().mockResolvedValue(() => {
    return { a: 'test', toJSON: () => mockPaymentTicket() };
  });

  static findOne = () => {
    return {
      lean: () => mockPaymentTicket(),
    };
  };

  static findById = () => {
    return {
      lean: () => mockPaymentTicket(),
    };
  };

  static findOneAndUpdate = () => {
    return {
      lean: () => mockPaymentTicket(),
    };
  };

  static create = () => {
    return {
      toJSON: () => mockPaymentTicket(),
    };
  };

  static find = () => {
    return {
      limit: () => {
        return {
          skip: () => {
            return {
              sort: () => [mockPaymentTicket()],
            };
          },
        };
      },
    };
  };

  static countDocuments = jest.fn().mockResolvedValue(1);
}

export const mockPaymentTicket = (): PaymentEntity =>
  ({
    _id: '6308f9e16888f167bc3671a5',
    paymentType: PaymentTypes.TICKET,
    errorMessage: null,
    status: PaymentStatus.SUCCESS,
    metadata: {
      cashBackValueReceived: 80,
      amount: 2000,
      billet: '82650000001132311699000900202215332047616454199',
      transactiondId: '416c203b-1842-4a10-baad-fbfab50de355',
    },
    retryPay: 0,
    userId: '1238f9e16888f167bc3678f4',
    paymentDate: new Date(),
  } as PaymentEntity);
