import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '../schemas';

export class GetTransactionHistoryDto {
  @ApiPropertyOptional({
    name: 'startDate',
    required: false,
    example: new Date(),
  })
  startDate?: Date;

  @ApiPropertyOptional({
    name: 'startDate',
    required: false,
    example: new Date(),
  })
  endDate?: Date;

  @ApiPropertyOptional({
    name: 'amount',
    required: false,
    example: '2000',
  })
  amount?: string;

  @ApiPropertyOptional({
    name: 'billet',
    required: false,
    example: '82650000001132311699000900202215332047616454199',
  })
  billet?: string;

  @ApiPropertyOptional({
    name: 'status',
    required: false,
    example: PaymentStatus.SUCCESS,
  })
  status?: string;

  @ApiPropertyOptional({
    name: 'page',
    required: false,
    example: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    name: 'pageSize',
    required: false,
    example: 5,
  })
  pageSize?: number;
}
