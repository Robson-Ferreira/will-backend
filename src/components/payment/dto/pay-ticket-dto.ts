import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class PayTicketDto {
  _id?: string;

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
    description: 'Ticket number',
    type: String,
    example: '82650000001132311699000900202215332047616454199',
    required: true,
  })
  @IsDefined()
  @IsString()
  billet: string;

  @ApiProperty({
    description: 'Payment Amount',
    type: String,
    example: '2000',
    required: true,
  })
  @IsDefined()
  @IsString()
  amount: string;
}
