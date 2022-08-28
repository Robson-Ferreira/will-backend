import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from './pay-ticket-response.dto';

class TransactionHistoryResponseDto {
  _id: string;
  metadata: Metadata;
  status: string;
  paymentDate: Date;
}

export class TransactionHistoryResponsePaginatedDto {
  @ApiProperty({
    type: Number,
    example: 100,
  })
  count: number;

  @ApiProperty({
    type: Number,
    example: 5,
  })
  pageSize: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  page: number;

  @ApiProperty({
    type: [TransactionHistoryResponseDto],
    example: {
      _id: '63058a9cf3006701d40189f5',
      metadata: {
        cashBackValueReceived: 80,
        billet: '82650000001132311699000900202215332047616454199',
        amount: '2000',
        transactiondId: '416c203b-1842-4a10-baad-fbfab50de355',
      },
      status: 'SUCCESS',
      paymentDate: new Date(),
    },
  })
  data: TransactionHistoryResponseDto[];
}
