import { mockUser, UserServiceSpy } from '../user/test';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto';
import * as bcrypt from 'bcryptjs';
import { UserServiceInterface } from '../user/interface';

type SutTypes = {
  sut: AuthService;
  userServiceSpy: UserServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthService,
      JwtService,
      {
        provide: 'UserServiceInterface',
        useClass: UserServiceSpy,
      },
    ],
  }).compile();

  const sut = module.get<AuthService>(AuthService);
  const userServiceSpy = module.get<UserServiceInterface>(
    'UserServiceInterface',
  ) as UserServiceSpy;

  return { sut, userServiceSpy };
};

describe('AuthService', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should login and return an access token', async () => {
    const { sut } = await makeSut();

    const mockedUser = mockUser();

    const payload: LoginRequestDto = {
      email: mockedUser.email,
      password: mockedUser.password,
    };

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((): any => true);

    jest
      .spyOn(sut, 'generateToken')
      .mockImplementationOnce((): any => 'ASDF123');

    const response = await sut.login(payload);

    expect(response).toHaveProperty('accessToken');
  });

  it('should return error "User not found." when logging in', async () => {
    const { sut, userServiceSpy } = await makeSut();

    jest
      .spyOn(userServiceSpy, 'getUserByEmail')
      .mockImplementationOnce((): any => null);

    const mockedUser = mockUser();

    const payload: LoginRequestDto = {
      email: mockedUser.email,
      password: mockedUser.password,
    };

    await expect(async () => {
      await sut.login(payload);
    }).rejects.toThrowError('User not found.');
  });

  it('should return error "Invalid email or password" because the password is incorrect', async () => {
    const { sut } = await makeSut();

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((): any => false);

    const mockedUser = mockUser();

    const payload: LoginRequestDto = {
      email: mockedUser.email,
      password: 'ASDF123',
    };

    await expect(async () => {
      await sut.login(payload);
    }).rejects.toThrowError('Invalid email or password');
  });
});
