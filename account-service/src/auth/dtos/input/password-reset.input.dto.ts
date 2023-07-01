import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordResetInputDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsNotEmpty()
  @IsJWT()
  token: string;
}
