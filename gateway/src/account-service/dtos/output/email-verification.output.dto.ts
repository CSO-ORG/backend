import { ACCOUNT_SERVICE_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: ACCOUNT_SERVICE_MESSAGE.VERIFICATION_EMAIL_SENT,
  })
  message: string;
}
