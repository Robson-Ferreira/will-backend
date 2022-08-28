import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'metrics', timestamps: true })
export class MetricsEntity extends Document {
  @Prop({ type: String, required: true })
  campaign: string;

  @Prop({ type: Boolean, required: true })
  active: boolean;

  @Prop({ type: Array, required: true, default: [] })
  newUsers: string[];

  @Prop({ type: Number, required: true, default: 0 })
  failedPayments: number;

  @Prop({ type: Number, required: true, default: 0 })
  successfulPayments: number;
}

export type MetricsDocument = MetricsEntity & Document;

export const MetricsSchema = SchemaFactory.createForClass(MetricsEntity);
