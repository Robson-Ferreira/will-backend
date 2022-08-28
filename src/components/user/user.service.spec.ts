import { AuthServiceSpy } from '../auth/test/mock-auth-service';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UserDocument, UserEntity } from './schemas';
import { mockUser, MockUserModel } from './test';
import { UserService } from './user.service';
import { AuthServiceInterface } from '../auth/interface';

type SutTypes = {
  sut: UserService;
  UserModel: Model<UserDocument>;
  authServiceSpy: AuthServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getModelToken(UserEntity.name),
        useValue: MockUserModel,
      },
      {
        provide: 'AuthServiceInterface',
        useClass: AuthServiceSpy,
      },
      {
        provide: 'MetricsServiceInterface',
        useClass: jest.fn(),
      },
    ],
  }).compile();

  const sut = module.get<UserService>(UserService);
  const UserModel = module.get(getModelToken(UserEntity.name));
  const authServiceSpy = module.get<AuthServiceInterface>(
    'AuthServiceInterface',
  ) as AuthServiceSpy;

  return { sut, UserModel, authServiceSpy };
};

describe('UserService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should get a user by email and return a record', async () => {
    const { sut } = await makeSut();

    const mockedUser = mockUser();

    const user = await sut.getUserByEmail(mockedUser.email);

    expect(user.email).toBe(mockedUser.email);
  });

  it('should get a user by id and return a record', async () => {
    const { sut } = await makeSut();

    const mockedUser = mockUser();

    const user = await sut.getUserById(mockedUser._id);

    expect(user._id).toBe(mockedUser._id);
  });

  it('should update a user by id and return a record', async () => {
    const { sut, UserModel } = await makeSut();

    const mockedUser = mockUser();

    jest
      .spyOn(UserModel, 'findOneAndUpdate')
      .mockImplementationOnce((): any => {
        return {
          lean: () => {
            return { ...mockedUser, balance: 20 };
          },
        };
      });

    const response = await sut.findOneAndUpdate(mockedUser._id, {
      balance: { $inc: 20 },
    });

    expect(response).toStrictEqual({ ...mockedUser, balance: 20 });
  });

  it('should successfully create a user', async () => {
    const { sut, authServiceSpy, UserModel } = await makeSut();

    const payload = mockUser();

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce((): any => {
      return {
        lean: () => {
          return null;
        },
      };
    });

    const user = await sut.createUser(payload);

    expect(user).toHaveProperty('accessToken');
    expect(authServiceSpy.callsCount).toBe(1);
  });

  it('should create a user and receive the message "User already exists"', async () => {
    const { sut, authServiceSpy, UserModel } = await makeSut();

    const payload = mockUser();

    jest.spyOn(UserModel, 'findOne').mockImplementationOnce((): any => {
      return {
        lean: () => {
          return mockUser();
        },
      };
    });

    expect(authServiceSpy.callsCount).toBe(0);
    await expect(async () => {
      await sut.createUser(payload);
    }).rejects.toThrowError('User already exists.');
  });
});
