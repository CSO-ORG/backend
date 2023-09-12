import { GENERIC_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class ImportAlertsOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: GENERIC_MESSAGE.RESOURCES_IMPORTED,
  })
  message: string;

  @ApiProperty({
    type: Number,
    description: 'the number of alerts saved in db',
    default: 0,
  })
  totalSavedAlerts: number;
}
