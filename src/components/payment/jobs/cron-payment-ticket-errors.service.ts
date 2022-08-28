import { Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Env } from '../../../commons/environment';
import { PaymentServiceInterface } from '../interface';
import {
  PaymentDocument,
  PaymentEntity,
  PaymentStatus,
  PaymentTypes,
} from '../schemas';
import { sendMail } from '../../../commons/notification/email';
import { UserServiceInterface } from '../../../components/user/interface';
import { templates } from '../../../commons/mock';

export class CronPaymentService {
  private readonly logger = new Logger(CronPaymentService.name);

  constructor(
    @InjectModel(PaymentEntity.name)
    private readonly PaymentModel: Model<PaymentDocument>,
    @Inject('PaymentServiceInterface')
    private readonly paymentService: PaymentServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async retryPayPendingTickets(): Promise<void> {
    const paymentsError = await this.PaymentModel.find({
      status: PaymentStatus.PENDING,
      paymentType: PaymentTypes.TICKET,
      retryPay: {
        $lt: Env.LIMIT_TO_TRY_PAY_AGAIN,
      },
    });

    if (paymentsError.length) {
      this.logger.log(
        `${
          PaymentTypes.TICKET
        }: Trying to make payment again for the pending tickets. PaymentIds: ${JSON.stringify(
          paymentsError.map((payment) => payment._id),
        )}`,
      );
    }

    for await (const payment of paymentsError) {
      const paymentAgain = await this.paymentService.payTicket(
        {
          _id: payment.id,
          billet: payment.metadata.billet,
          amount: payment.metadata.amount,
        },
        payment.userId,
      );

      if (paymentAgain.retryPay === Env.LIMIT_TO_TRY_PAY_AGAIN) {
        await this.PaymentModel.findOneAndUpdate(
          paymentAgain.id,
          {
            status: PaymentStatus.ERROR,
          },
          { useFindAndModify: false },
        );
        await this.notifyUserByEmail(payment);
      }
    }
  }

  private async notifyUserByEmail(payment: PaymentDocument): Promise<void> {
    const { email: userEmail } = await this.userService.getUserById(
      payment.userId,
    );

    const { content } = templates.find(
      (t) => t.key === 'TEMPALTE_TICKET_PAYMENT_ERROR',
    );

    await sendMail(userEmail, content);
  }
}
