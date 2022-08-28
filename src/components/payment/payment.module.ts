import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentEntity, PaymentSchema } from './schemas';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RemotePaymentService } from './remote';
import { MongooseModule } from '@nestjs/mongoose';
import { CashBackModule } from '../cash-back/cash-back.module';
import { UserModule } from '../user/user.module';
import { PaymentProcessService } from './payment-process.service';
import { CronPaymentService } from './jobs';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentEntity.name, schema: PaymentSchema },
    ]),
    MetricsModule,
    CashBackModule,
    UserModule,
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [
    CronPaymentService,
    {
      provide: 'PaymentServiceInterface',
      useClass: PaymentService,
    },
    {
      provide: 'RemotePaymentServiceInterface',
      useClass: RemotePaymentService,
    },
    {
      provide: 'PaymentProcessServiceInterface',
      useClass: PaymentProcessService,
    },
  ],
  exports: [],
})
export class PaymentModule {}
