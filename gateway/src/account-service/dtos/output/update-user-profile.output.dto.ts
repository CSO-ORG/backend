import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileOutputDto {
  @ApiProperty({
    type: String,
    description: 'a status message of the update operation',
    default: 'Profile updated successfully',
  })
  message: string;
}
