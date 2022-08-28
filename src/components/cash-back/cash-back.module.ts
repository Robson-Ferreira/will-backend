import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashBackEntity, CashBackSchema } from './schemas';
import { CashBackService } from './cash-back.service';
import { CashBackController } from './cash-back.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CashBackEntity.name, schema: CashBackSchema },
    ]),
  ],
  controllers: [CashBackController],
  providers: [
    {
      provide: 'CashBackServiceInterface',
      useClass: CashBackService,
    },
  ],
  exports: [
    {
      provide: 'CashBackServiceInterface',
      useClass: CashBackService,
    },
  ],
})
export class CashBackModule {}
