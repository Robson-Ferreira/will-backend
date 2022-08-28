import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentModule } from './components/payment/payment.module';
import { Env } from './commons/environment';
import { CashBackModule } from './components/cash-back/cash-back.module';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { MetricsModule } from './components/metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forRoot(Env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    HttpModule,
    PaymentModule,
    CashBackModule,
    MetricsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
