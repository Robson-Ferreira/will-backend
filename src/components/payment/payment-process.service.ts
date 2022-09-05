import {
  PaymentTypes,
  PaymentStatus,
  PaymentEntity,
  PaymentDocument,
} from './schemas';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { PaymentProcessServiceInterface } from './interface';
import { Inject, Logger } from '@nestjs/common';
import { templates } from 'src/commons/mock';
import { UserServiceInterface } from '../user/interface';
import { sendMail } from 'src/commons/notification/email';

export class PaymentProcessService implements PaymentProcessServiceInterface {
  private readonly logger = new Logger(PaymentProcessService.name);

  constructor(
    @InjectModel(PaymentEntity.name)
    private readonly PaymentModel: Model<PaymentDocument>,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  async registerPaymentTicketSuccess(
    userId: string,
    data: any,
  ): Promise<LeanDocument<PaymentEntity>> {
    const { _id: paymentId } = data;

    const payment = await this.PaymentModel.findById(paymentId ?? null).lean();

    if (!payment) {
      const newPayment = await this.PaymentModel.create({
        userId,
        metadata: data,
        paymentType: PaymentTypes.TICKET,
        status: PaymentStatus.SUCCESS,
        paymentDate: new Date(),
      });

      await this.notifyUserByEmailPaymentSuccess(newPayment);

      return newPayment;
    }

    this.logger.log(
      `New attempt to pay ticket with ID = ${payment._id} performed and successfully completed!`,
    );

    delete data._id;

    const paymentSuccess = await this.PaymentModel.findOneAndUpdate(
      { _id: paymentId },
      {
        metadata: data,
        status: PaymentStatus.SUCCESS,
        errorMessage: null,
      },
      {
        useFindAndModify: false,
      },
    ).lean();

    await this.notifyUserByEmailPaymentSuccess(paymentSuccess);

    return paymentSuccess;
  }

  private async notifyUserByEmailPaymentSuccess(
    payment: LeanDocument<PaymentDocument>,
  ): Promise<void> {
    const { email: userEmail } = await this.userService.getUserById(
      payment.userId,
    );

    const { content } = templates.find(
      (t) => t.key === 'TEMPALTE_TICKET_PAYMENT_SUCCESS',
    );

    await sendMail(userEmail, content);
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
        retryPay: 1,
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
