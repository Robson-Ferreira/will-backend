import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber } from 'class-validator';

export class CreateCashBackDto {
  @ApiProperty({
    description: 'Cash Back Rule Active',
    type: Boolean,
    example: true,
    required: true,
  })
  @IsDefined()
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    description: 'From (Range)',
    type: Number,
    example: 1000,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  from: number;

  @ApiProperty({
    description: 'To (Range)',
    type: Number,
    example: 5000,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  to: number;

  @ApiProperty({
    description: 'Cash Back Percentage %',
    type: Number,
    example: 2,
    required: true,
  })
  @IsDefined()
  @IsNumber()
  percentage: number;
}
