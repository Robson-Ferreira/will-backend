import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateMetricDto {
  @ApiProperty({
    description: 'Campaign',
    type: String,
    example: 'CASHBACK100',
    required: true,
  })
  @IsDefined()
  @IsString()
  campaign: string;

  @ApiProperty({
    description: 'Active',
    type: String,
    example: true,
    required: true,
  })
  @IsDefined()
  @IsString()
  active: boolean;
}
