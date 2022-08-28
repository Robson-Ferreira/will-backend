import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsDefined,
  IsString,
  MaxLength,
  Validate,
  Matches,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CustomNameContainsNumber } from '../validators';

export class CreateUserDto {
  @ApiProperty({
    description: 'Campaign',
    type: String,
    example: 'CASHBACK100',
    required: true,
  })
  @IsOptional()
  @IsString()
  campaign?: string;

  @ApiProperty({
    description: 'Is admin system',
    type: Boolean,
    example: false,
    required: true,
  })
  @IsDefined()
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({
    description: 'First name',
    type: String,
    example: 'Jack',
    required: true,
  })
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @Validate(CustomNameContainsNumber)
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    example: 'Ryan',
    required: true,
  })
  @IsDefined()
  @IsString()
  @MaxLength(20)
  @Validate(CustomNameContainsNumber)
  lastName: string;

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
    minLength: 6,
    maxLength: 64,
    type: String,
    example: '123456aA@',
    required: true,
  })
  @IsDefined()
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,64}$/gm, {
    message:
      'Password must be between 6 and 64 characters with 1 special character, 1 lowercase and 1 uppercase letter.',
  })
  password: string;
}
