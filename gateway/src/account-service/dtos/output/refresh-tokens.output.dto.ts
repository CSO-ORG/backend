import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokensOutputDto {
  @ApiProperty({
    type: String,
    description: 'access token',
    default: 'eyadsjdabsdkasndlksnalkdnas',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    description: 'refresh token',
    default: 'eyadsadsjdsakdnsakdnsalkdn',
  })
  refreshToken: string;
}
