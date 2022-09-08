import { LeanDocument } from 'mongoose';
import { CreateMetricDto } from '../dto';
import { MetricsEntity } from '../schemas';

export interface MetricsServiceInterface {
  createMetric(payload: CreateMetricDto): Promise<MetricsEntity>;

  getMetricCampaign(campaignName: string): Promise<LeanDocument<MetricsEntity>>;

  updateCampaignValues(campaignName: string, data: any): Promise<MetricsEntity>;
}
