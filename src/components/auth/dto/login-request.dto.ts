import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'User E-mail',
    type: String,
    example: 'jack.ryan@email.com',
    required: true,
  })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    type: String,
    example: '123456aA@',
    required: true,
  })
  @IsDefined()
  @IsString()
  password: string;
}
