import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageInputDto {
  @ApiProperty({
    type: String,
    description: 'the base64 format of the image to be uploaded',
    default: 'randomstring',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
