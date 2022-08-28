import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  cashBackValueReceived: number;
  billet: string;
  amount: string;
  transactiondId: string;
}

export class PayTicketResponseDto {
  @ApiProperty({
    type: String,
    example: '63058a9cf3006701d40189f5',
  })
  _id: string;

  @ApiProperty({
    type: Number,
    example: 0,
  })
  retryPay: string;

  @ApiProperty({
    type: String,
    example: null,
  })
  errorMessage: string;

  @ApiProperty({
    type: String,
    example: '6305878e94324d46a011dadd',
  })
  userId: string;

  @ApiProperty({
    type: Metadata,
    example: {
      cashBackValueReceived: 80,
      billet: '82650000001132311699000900202215332047616454199',
      amount: '2000',
      transactiondId: '416c203b-1842-4a10-baad-fbfab50de355',
    },
  })
  metadata: Metadata;

  @ApiProperty({
    type: String,
    example: 'TICKET',
  })
  paymentType: string;

  @ApiProperty({
    type: String,
    example: 'SUCCESS',
  })
  status: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  paymentDate: Date;

  @ApiProperty({
    type: Date,
    example: '2022-08-25T18:30:29.059Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: '2022-08-25T18:30:29.059Z',
  })
  updatedAt: Date;
}
