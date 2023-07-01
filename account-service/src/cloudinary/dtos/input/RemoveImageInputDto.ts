import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveImageInputDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;
}
