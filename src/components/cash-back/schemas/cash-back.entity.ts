import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'cash-back', timestamps: true })
export class CashBackEntity extends Document {
  @Prop({ type: Number, required: true })
  from: number;

  @Prop({ type: Number, required: true })
  to: number;

  @Prop({ type: Number, required: true })
  percentage: number;

  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  active: boolean;
}

export type CashBackDocument = CashBackEntity & Document;

export const CashBackSchema = SchemaFactory.createForClass(CashBackEntity);
