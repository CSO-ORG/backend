import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageInputDto {
  @IsString()
  @IsNotEmpty()
  image: string;
}
