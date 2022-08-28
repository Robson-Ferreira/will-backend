import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'user', timestamps: true })
export class UserEntity extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number, required: false, default: 0 })
  balance: number;

  @Prop({ type: Boolean, required: false, default: 0 })
  isAdmin: boolean;
}

export type UserDocument = UserEntity & Document;

export const UserSchema = SchemaFactory.createForClass(UserEntity);
