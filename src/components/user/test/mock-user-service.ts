import { LeanDocument } from 'mongoose';
import { CreateUserDto } from '../dto';
import { UserServiceInterface } from '../interface';
import { UserEntity } from '../schemas';
import { mockUser } from './mock-user-entity';

export class UserServiceSpy implements UserServiceInterface {
  callsCount = 0;
  payload: CreateUserDto = null;

  getUserByEmail(): Promise<LeanDocument<UserEntity>> {
    return Promise.resolve(mockUser());
  }

  getUserById(): Promise<LeanDocument<UserEntity>> {
    throw new Error('Method not implemented.');
  }

  createUser(data: CreateUserDto): Promise<UserEntity> {
    this.payload = data;
    this.callsCount++;
    return Promise.resolve(mockUser());
  }

  findOneAndUpdate(): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}

export const mockCreateUserDto = (): CreateUserDto =>
  ({
    isAdmin: false,
    firstName: 'Jack',
    lastName: 'Ryan',
    email: 'jack.ryan@email.com',
    password: '123456aA@',
  } as CreateUserDto);
