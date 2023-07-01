import { ACCOUNT_SERVICE_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: ACCOUNT_SERVICE_MESSAGE.PASSWORD_RESET,
  })
  message: string;
}
