import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenInputDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
