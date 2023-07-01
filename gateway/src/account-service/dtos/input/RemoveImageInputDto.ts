import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveImageInputDto {
  @ApiProperty({
    type: String,
    description: 'the public id of the image',
    default: 'randomstring',
  })
  @IsString()
  @IsNotEmpty()
  public_id: string;
}
