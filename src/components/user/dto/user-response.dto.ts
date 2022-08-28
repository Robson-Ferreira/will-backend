import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    type: String,
    example: '6307bfc5dc751f0134da5fde',
  })
  _id: string;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    type: Number,
    example: 539.35,
  })
  balance: number;

  @ApiProperty({
    type: String,
    example: 'Jack',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Ryan',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    example: 'jack.ryan@email.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzA3YzEyZWIxNTUxODM1OTQxZjY5ZWIiLCJlbWFpbCI6Im1hdGV1YXNkc3MuYXNmYWR1cmZhYWZ2YWFhbGZAZ21haWwuY29tIiwiaWF0IjoxNjYxNDUyNTkwLCJleHAiOjE2NjE0NTk3OTB9.kgqzy2Srj2ggJ_sdMiqiieccLplw87IzuPUsGxKLxys',
  })
  accessToken: string;

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
