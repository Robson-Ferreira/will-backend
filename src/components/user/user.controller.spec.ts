import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceInterface } from './interface';
import { mockCreateUserDto, UserServiceSpy } from './test/mock-user-service';
import { UserController } from './user.controller';

type SutTypes = {
  sut: UserController;
  userService: UserServiceSpy;
};

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UserController,
      {
        provide: 'UserServiceInterface',
        useClass: UserServiceSpy,
      },
    ],
  }).compile();

  const sut = module.get<UserController>(UserController);
  const userService = module.get<UserServiceInterface>(
    'UserServiceInterface',
  ) as UserServiceSpy;

  return { sut, userService };
};

describe('UserController', () => {
  it('should be defined', async () => {
    const { sut } = await makeSut();

    expect(sut).toBeDefined();
  });

  it('should call the create user function which is received through the endpoint', async () => {
    const { sut, userService } = await makeSut();

    const payload = mockCreateUserDto();

    const response = await sut.createUser(payload);

    expect(response).toHaveProperty('_id');
    expect(userService.callsCount).toBe(1);
    expect(userService.payload).toBe(payload);
  });
});
