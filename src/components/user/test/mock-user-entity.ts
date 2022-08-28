import { UserEntity } from '../schemas';

export class MockUserModel {
  save = jest.fn().mockResolvedValue(() => {
    return { a: 'test', toJSON: () => mockUser() };
  });

  static findOne = () => {
    return {
      lean: () => mockUser(),
    };
  };

  static findById = () => {
    return {
      lean: () => mockUser(),
    };
  };

  static findOneAndUpdate = () => {
    return {
      lean: () => mockUser(),
    };
  };

  static create = () => {
    return {
      toJSON: () => mockUser(),
    };
  };

  static find = () => {
    return {
      limit: () => {
        return {
          skip: () => {
            return {
              sort: () => [mockUser()],
            };
          },
        };
      },
    };
  };

  static countDocuments = jest.fn().mockResolvedValue(1);
}

export const mockUser = (): UserEntity =>
  ({
    _id: '630848ac1fe74d083c5cc606',
    firstName: 'Jack',
    lastName: 'Ryan',
    email: 'jack.ryan@email.com',
    password: '123456aA@',
    balance: 0,
    isAdmin: false,
  } as UserEntity);
