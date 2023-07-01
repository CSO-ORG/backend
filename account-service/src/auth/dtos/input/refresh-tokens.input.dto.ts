import { IsEmail, IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokensInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
