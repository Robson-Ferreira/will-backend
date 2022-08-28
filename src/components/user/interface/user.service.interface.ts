import { LeanDocument } from 'mongoose';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../schemas';

export interface UserServiceInterface {
  getUserByEmail(emailAddress: string): Promise<LeanDocument<UserEntity>>;

  getUserById(userId: string): Promise<LeanDocument<UserEntity>>;

  createUser(data: CreateUserDto): Promise<UserEntity>;

  findOneAndUpdate(userId: string, data: any): Promise<UserEntity>;
}
