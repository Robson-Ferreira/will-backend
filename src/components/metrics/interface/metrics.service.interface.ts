import { CreateMetricDto } from '../dto';
import { MetricsEntity } from '../schemas';

export interface MetricsServiceInterface {
  createMetric(payload: CreateMetricDto): Promise<MetricsEntity>;

  updateCampaignValues(campaignName: string, data: any): Promise<MetricsEntity>;
}
