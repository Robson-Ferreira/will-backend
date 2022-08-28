import { ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMetricDto } from './dto';
import { MetricsServiceInterface } from './interface';
import { MetricsDocument, MetricsEntity } from './schemas';

export class MetricsService implements MetricsServiceInterface {
  constructor(
    @InjectModel(MetricsEntity.name)
    private readonly MetricsModel: Model<MetricsDocument>,
  ) {}

  async createMetric(payload: CreateMetricDto): Promise<MetricsEntity> {
    const metric = await this.MetricsModel.findOne({
      campaign: payload.campaign,
    }).lean();

    if (metric) {
      throw new ConflictException(
        `Campaign with name: ${metric.campaign} already exists.`,
      );
    }

    return this.MetricsModel.create(payload);
  }

  async updateCampaignValues(
    campaignName: string,
    data: any,
  ): Promise<MetricsEntity> {
    const campaign = await this.MetricsModel.findOne({
      campaign: campaignName,
    }).lean();

    if (!campaign) {
      return null;
    }

    return this.MetricsModel.findOneAndUpdate(
      { campaign: campaignName },
      data,
      { useFindAndModify: false, new: true },
    ).lean();
  }
}
