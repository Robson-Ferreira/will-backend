import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { MetricsEntity, MetricsSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MetricsEntity.name, schema: MetricsSchema },
    ]),
  ],
  controllers: [MetricsController],
  providers: [
    {
      provide: 'MetricsServiceInterface',
      useClass: MetricsService,
    },
  ],
  exports: [
    {
      provide: 'MetricsServiceInterface',
      useClass: MetricsService,
    },
  ],
})
export class MetricsModule {}
