import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentTypes {
  TICKET = 'TICKET',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
}

@Schema({ collection: 'payment', timestamps: true })
export class PaymentEntity extends Document {
  @Prop({ enum: PaymentTypes, required: true })
  paymentType: PaymentTypes;

  @Prop({ enum: PaymentStatus, required: true })
  status: PaymentStatus;

  @Prop({ type: String, required: false, default: null })
  errorMessage?: string;

  @Prop({ type: Object, required: true })
  metadata: any;

  @Prop({ type: Number, default: 0 })
  retryPay?: number;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, required: false, default: null })
  paymentDate: Date;
}

export type PaymentDocument = PaymentEntity & Document;

export const PaymentSchema = SchemaFactory.createForClass(PaymentEntity);

PaymentSchema.index({ 'metadata.billet': 1 }, { unique: true });
