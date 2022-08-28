import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'src/commons/environment';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: Env.JWT_SECRET_HASH,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
