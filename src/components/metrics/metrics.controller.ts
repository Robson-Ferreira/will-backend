import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsAdminGuard, JWTGuard } from '../../commons/guards';
import { CreateMetricDto } from './dto';
import { MetricsServiceInterface } from './interface';

@Controller('campaign')
@ApiTags('Campaign')
export class MetricsController {
  constructor(
    @Inject('MetricsServiceInterface')
    private readonly metricsService: MetricsServiceInterface,
  ) {}

  @Post()
  @UseGuards(JWTGuard, IsAdminGuard)
  async createMetric(@Body() payload: CreateMetricDto): Promise<any> {
    return this.metricsService.createMetric(payload);
  }
}
