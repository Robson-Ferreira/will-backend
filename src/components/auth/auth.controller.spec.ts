import { mockUser } from '../user/test';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginRequestDto } from './dto';
import { AuthServiceSpy, mockLoginReponseDto } from './test';

type SutTypes = {
  sut: AuthController;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AuthController,
      {
        provide: 'AuthServiceInterface',
        useClass: AuthServiceSpy,
      },
    ],
  }).compile();

  const sut = module.get<AuthController>(AuthController);

  return { sut };
};

describe('AuthController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should call the login auth function which is received through the endpoint', async () => {
    const { sut } = await makeSut();

    const mockedUser = mockUser();

    const payload: LoginRequestDto = {
      email: mockedUser.email,
      password: mockedUser.password,
    };

    const response = await sut.login(payload);

    expect(response).toHaveProperty('accessToken');
    expect(response.accessToken).toBe(mockLoginReponseDto().accessToken);
  });
});
