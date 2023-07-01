import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
