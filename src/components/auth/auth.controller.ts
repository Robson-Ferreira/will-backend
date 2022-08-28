import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto';
import { AuthServiceInterface } from './interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) {}

  @Post('/login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(data);
  }
}
