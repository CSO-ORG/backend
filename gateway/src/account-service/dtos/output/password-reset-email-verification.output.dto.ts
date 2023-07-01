import { ACCOUNT_SERVICE_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordEmailVerificationOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: ACCOUNT_SERVICE_MESSAGE.PASSWORD_RESET_EMAIL_SENT,
  })
  message: string;
}
