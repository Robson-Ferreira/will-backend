import { Inject } from '@nestjs/common';
import { GetTransactionHistoryDto, PayTicketDto } from './dto';
import {
  PaymentProcessServiceInterface,
  PaymentServiceInterface,
  RemotePaymentServiceInterface,
  RemoteResponsePaymentService,
} from './interface';
import { CashBackServiceInterface } from '../cash-back/interface';
import { UserServiceInterface } from '../user/interface';
import { PaymentDocument, PaymentEntity, PaymentTypes } from './schemas';
import { LeanDocument, Model } from 'mongoose';
import { Env } from '../../commons/environment';
import { InjectModel } from '@nestjs/mongoose';
import { MetricsServiceInterface } from '../metrics/interface';

export class PaymentService implements PaymentServiceInterface {
  constructor(
    @InjectModel(PaymentEntity.name)
    private readonly PaymentModel: Model<PaymentDocument>,
    @Inject('RemotePaymentServiceInterface')
    private readonly remotePaymentService: RemotePaymentServiceInterface,
    @Inject('CashBackServiceInterface')
    private readonly cashBackService: CashBackServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    @Inject('PaymentProcessServiceInterface')
    private readonly paymentProcess: PaymentProcessServiceInterface,
    @Inject('MetricsServiceInterface')
    private readonly metricsService: MetricsServiceInterface,
  ) {}

  async payTicket(
    payload: PayTicketDto,
    userId: string,
  ): Promise<LeanDocument<PaymentEntity>> {
    try {
      const providerResponse: RemoteResponsePaymentService =
        await this.remotePaymentService.pay({
          payloadToSend: payload,
          paymentProviderEndpoint: Env.PAYMENT_TICKET_PROVIDER_ENDPOINT,
        });

      const cashBackValue = await this.getCashBack(payload);

      const payment = this.paymentProcess.registerPaymentTicketSuccess(userId, {
        ...{ cashBackValueReceived: cashBackValue },
        ...payload,
        ...providerResponse,
      });

      if (cashBackValue) {
        await this.updateUserCashBack(userId, cashBackValue);
      }

      if (payload.campaign) {
        await this.metricsService.updateCampaignValues(payload.campaign, {
          $inc: {
            successfulPayments: 1,
          },
        });
      }

      return payment;
    } catch (error: any) {
      if (payload.campaign) {
        await this.metricsService.updateCampaignValues(payload.campaign, {
          $inc: {
            failedPayments: 1,
          },
        });
      }

      return this.paymentProcess.registerPaymentError(
        userId,
        error.message,
        payload,
      );
    }
  }

  private async getCashBack(payload: PayTicketDto): Promise<number> {
    const cashBack = await this.cashBackService.getCashBackByValue(
      +payload.amount,
    );

    if (cashBack) {
      return (+payload.amount * cashBack.percentage) / 100;
    }

    return 0;
  }

  private async updateUserCashBack(
    userId: string,
    value: number,
  ): Promise<void> {
    await this.userService.findOneAndUpdate(userId, {
      $inc: { balance: value },
    });
  }

  async hasBeenPaid(billet: string): Promise<PaymentEntity> {
    return this.PaymentModel.findOne({
      'metadata.billet': billet,
    }).lean();
  }

  async getTransactionHistory(
    userId: string,
    query: GetTransactionHistoryDto,
  ): Promise<[number, number, number, LeanDocument<PaymentEntity[]>]> {
    const filterConditions: any = {};

    if (query?.startDate && query?.endDate) {
      filterConditions.paymentDate = {
        $gte: query?.startDate,
        $lte: query?.endDate,
      };
    }

    if (query?.status) {
      filterConditions.status = query?.status;
    }

    if (query?.amount) {
      filterConditions.amount = query?.amount;
    }

    if (query?.billet) {
      filterConditions.billet = Array.isArray(query?.billet)
        ? { $in: query?.billet }
        : query.billet;
    }

    const count = await this.PaymentModel.countDocuments({
      ...filterConditions,
      userId,
    });

    const pageSize = query?.pageSize ? Number(query?.pageSize) : 5;
    const page = query?.page ? Number(query?.page) : 1;

    const result = await this.PaymentModel.find({
      ...filterConditions,
      paymentType: PaymentTypes.TICKET,
      userId,
    })
      .select({ metadata: 1, status: 1, paymentDate: 1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    return [count, pageSize, page, result];
  }
}
