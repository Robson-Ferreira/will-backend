import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { UserServiceInterface } from './interface';
import { UserDocument, UserEntity } from './schemas';
import * as bcrypt from 'bcryptjs';
import { ConflictException, forwardRef, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { AuthServiceInterface } from '../auth/interface';
import { MetricsServiceInterface } from '..//metrics/interface';

export class UserService implements UserServiceInterface {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly UserModel: Model<UserDocument>,
    @Inject('MetricsServiceInterface')
    private readonly metricsService: MetricsServiceInterface,
    @Inject(forwardRef(() => 'AuthServiceInterface'))
    private readonly authService: AuthServiceInterface,
  ) {}

  async getUserByEmail(
    emailAddress: string,
  ): Promise<LeanDocument<UserEntity>> {
    return this.UserModel.findOne({ email: emailAddress }).lean();
  }

  async getUserById(userId: string): Promise<LeanDocument<UserEntity>> {
    return this.UserModel.findById(userId).lean();
  }

  async findOneAndUpdate(userId: string, data: any): Promise<UserEntity> {
    return this.UserModel.findOneAndUpdate({ _id: userId }, data, {
      useFindAndModify: false,
    }).lean();
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    try {
      if (data.campaign) {
        await this.metricsService.updateCampaignValues(data.campaign, {
          newUsers: {
            $inc: 1,
          },
        });
      }

      const userAlreadyExists = await this.UserModel.findOne({
        email: data.email,
      }).lean();

      if (userAlreadyExists) {
        throw new ConflictException('User already exists.');
      }

      const encryptedPassword = await bcrypt.hash(data.password, 10);

      const user = (
        await this.UserModel.create({
          ...data,
          password: encryptedPassword,
        })
      ).toJSON();

      delete user.password;

      return {
        ...user,
        accessToken: this.authService.generateToken(user),
      } as any;
    } catch (error: any) {
      throw error;
    }
  }
}
