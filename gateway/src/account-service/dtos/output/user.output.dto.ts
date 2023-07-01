import { ACCOUNT_TYPE, PROFILE_PICTURE } from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserOutputDto {
  @ApiProperty({
    type: String,
    description: "user's email address",
    default: 'johndoe@email.com',
  })
  @Expose()
  email: string;
  @ApiProperty({
    type: String,
    description: "user's username",
    default: 'John',
  })
  @Expose()
  username: string;
  @ApiProperty({
    description: "user's profile picture url",
    default: 'http://cso-org.fr',
  })
  @Expose()
  profilePicture: PROFILE_PICTURE;
  @ApiProperty({
    type: String,
    description: "user's account type",
    default: ACCOUNT_TYPE.USER,
  })
  @Expose()
  accountType: string;
  @ApiProperty({
    type: Date,
    description: 'date of creation',
  })
  @Expose()
  createdAt: Date;
  @ApiProperty({
    type: Date,
    description: 'last date of modification',
  })
  @Expose()
  updatedAt: Date;
}
