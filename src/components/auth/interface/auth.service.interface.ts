import { LeanDocument } from 'mongoose';
import { UserEntity } from 'src/components/user/schemas';

export interface AuthServiceInterface {
  login(data: any): Promise<any>;

  generateToken(user: LeanDocument<UserEntity>): string;
}
