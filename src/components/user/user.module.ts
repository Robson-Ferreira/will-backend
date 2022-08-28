import { forwardRef, Module } from '@nestjs/common';
import { UserEntity, UserSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    MetricsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  exports: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
})
export class UserModule {}
