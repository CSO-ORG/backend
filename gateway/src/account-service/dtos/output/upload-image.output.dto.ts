import { ApiProperty } from '@nestjs/swagger';

export class UploadImageOutputDto {
  @ApiProperty({
    type: String,
    description: 'uploaded image public id',
    default: 'http://cso-org.com',
  })
  public_id: string;

  @ApiProperty({
    type: String,
    description: 'uploaded image url',
    default: 'http://cso-org.com',
  })
  url: string;
}
