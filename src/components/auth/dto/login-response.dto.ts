import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzA3YzEyZWIxNTUxODM1OTQxZjY5ZWIiLCJlbWFpbCI6Im1hdGV1YXNkc3MuYXNmYWR1cmZhYWZ2YWFhbGZAZ21haWwuY29tIiwiaWF0IjoxNjYxNDUyNTkwLCJleHAiOjE2NjE0NTk3OTB9.kgqzy2Srj2ggJ_sdMiqiieccLplw87IzuPUsGxKLxys',
  })
  accessToken: string;
}
