import {
  PaymentTypes,
  PaymentStatus,
  PaymentEntity,
  PaymentDocument,
} from './schemas';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { PaymentProcessServiceInterface } from './interface';
import { Logger } from '@nestjs/common';

export class PaymentProcessService implements PaymentProcessServiceInterface {
  private readonly logger = new Logger(PaymentProcessService.name);

  constructor(
    @InjectModel(PaymentEntity.name)
    private readonly PaymentModel: Model<PaymentDocument>,
  ) {}

  async registerPaymentTicketSuccess(
    userId: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>> {
    const { _id: paymentId } = data;

    const payment = await this.PaymentModel.findById(paymentId ?? null).lean();

    if (!payment) {
      return this.PaymentModel.create({
        userId,
        metadata: data,
        paymentType: PaymentTypes.TICKET,
        status: PaymentStatus.SUCCESS,
        paymentDate: new Date(),
      });
    }

    this.logger.log(
      `New attempt to pay ticket with ID = ${payment._id} performed and successfully completed!`,
    );

    return this.PaymentModel.findOneAndUpdate(
      { _id: paymentId },
      {
        status: PaymentStatus.SUCCESS,
        errorMessage: null,
      },
      {
        useFindAndModify: false,
      },
    ).lean();
  }

  async registerPaymentError(
    userId: string,
    errorMessage: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>> {
    const { _id: paymentId } = data;

    const payment = await this.PaymentModel.findById(paymentId ?? null).lean();

    if (!payment) {
      return this.PaymentModel.create({
        userId,
        metadata: data,
        paymentType: PaymentTypes.TICKET,
        status: PaymentStatus.PENDING,
        errorMessage,
      });
    }

    return this.PaymentModel.findOneAndUpdate(
      { _id: paymentId },
      { ...data, errorMessage, $inc: { retryPay: 1 } },
      {
        useFindAndModify: false,
        new: true,
      },
    ).lean();
  }
}
