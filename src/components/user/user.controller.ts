import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from './dto';
import { UserServiceInterface } from './interface';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @Post()
  @ApiOkResponse({ type: UserResponseDto })
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(data) as any;
  }
}
