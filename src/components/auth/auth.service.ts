import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { UserServiceInterface } from '../user/interface';
import { AuthServiceInterface } from './interface';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/schemas';
import { JwtService } from '@nestjs/jwt';
import { LeanDocument } from 'mongoose';
import { LoginRequestDto } from './dto';

export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(forwardRef(() => 'UserServiceInterface'))
    private readonly userService: UserServiceInterface,
    private readonly jwt: JwtService,
  ) {}

  async login(data: LoginRequestDto): Promise<any> {
    try {
      const user = await this.userService.getUserByEmail(data.email);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const isValid = await bcrypt.compare(data.password, user.password);

      if (!isValid) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.NOT_FOUND,
        );
      }

      delete user.password;

      return {
        ...user,
        accessToken: this.generateToken(user),
      };
    } catch (error: any) {
      throw error;
    }
  }

  generateToken(user: LeanDocument<UserEntity>): string {
    return this.jwt.sign({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
}
