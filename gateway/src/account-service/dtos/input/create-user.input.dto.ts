import { ACCOUNT_TYPE, PROFILE_PICTURE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    description: 'token sent to the user',
    default: 'thisisavalidtokencontainingusersemailaddress.pleasereplaceme',
  })
  @IsJWT()
  token: string;

  @ApiProperty({
    type: String,
    description: "user's password",
    default: '123456',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password: string;

  @ApiProperty({
    type: String,
    description: "user's username",
    default: 'john_doe269',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  username: string;

  @ApiProperty({
    description: "user's profile picture url",
    default: 'http://cso-org.fr',
  })
  @IsOptional()
  profilePicture: PROFILE_PICTURE;

  @ApiProperty({
    type: String,
    description: "user's account type",
    enum: ACCOUNT_TYPE,
    default: ACCOUNT_TYPE.USER,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ACCOUNT_TYPE)
  accountType: ACCOUNT_TYPE;
}
