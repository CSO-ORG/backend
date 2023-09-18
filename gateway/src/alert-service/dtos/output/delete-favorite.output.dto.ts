import { GENERIC_MESSAGE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteFavoriteOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message',
    default: GENERIC_MESSAGE.RESOURCE_DELETED,
  })
  message: string;
}
