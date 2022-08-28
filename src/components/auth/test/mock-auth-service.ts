import { LoginResponseDto } from '../dto';
import { AuthServiceInterface } from '../interface';

export class AuthServiceSpy implements AuthServiceInterface {
  callsCount = 0;

  login(): Promise<any> {
    return Promise.resolve(mockLoginReponseDto());
  }

  generateToken(): string {
    this.callsCount++;
    return mockLoginReponseDto().accessToken;
  }
}

export const mockLoginReponseDto = (): LoginResponseDto =>
  ({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzA4Zj',
  } as LoginResponseDto);
