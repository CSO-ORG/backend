import { GENERIC_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: GENERIC_MESSAGE.RESOURCE_CREATED,
  })
  message: string;
}
