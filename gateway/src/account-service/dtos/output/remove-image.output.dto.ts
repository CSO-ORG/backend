import { ApiProperty } from '@nestjs/swagger';

export class RemoveImageOutputDto {
  @ApiProperty({
    type: Boolean,
    description: 'a status message',
    default: true,
  })
  success: boolean;
}
