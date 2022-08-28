import { ApiProperty } from '@nestjs/swagger';

export class CashBackReponseDto {
  @ApiProperty({
    type: String,
    example: '6307bfc5dc751f0134da5fde',
  })
  _id: string;

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  active: true;

  @ApiProperty({
    type: Number,
    example: 1000,
  })
  from: number;

  @ApiProperty({
    type: Number,
    example: 5000,
  })
  to: number;

  @ApiProperty({
    type: Number,
    example: 2,
  })
  percentage: number;

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
