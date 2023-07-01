import { ACCOUNT_SERVICE_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: ACCOUNT_SERVICE_MESSAGE.USER_LOGGED_OUT,
  })
  message: string;
}
