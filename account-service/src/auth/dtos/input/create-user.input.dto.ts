import { ACCOUNT_TYPE, PROFILE_PICTURE } from '@cso-org/shared';
import {
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserInputDto {
  @IsJWT()
  token: string;

  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  username: string;

  @IsOptional()
  profilePicture: PROFILE_PICTURE;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ACCOUNT_TYPE)
  accountType: ACCOUNT_TYPE;
}
