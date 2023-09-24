import { ILOCATION } from '@cso-org/shared';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAlertInputDto {
  @IsString()
  @IsNotEmpty()
  publisherId: string;

  @IsString()
  @IsOptional()
  publisherPhoneNumber: string;

  @IsString()
  @IsOptional()
  publisherEmail: string;

  @IsBoolean()
  @IsNotEmpty()
  isFromAppUser: boolean;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  alertType: string;

  @IsString()
  @IsOptional()
  icadIdentifier: string;

  @IsString()
  @IsOptional()
  petType: string;

  @IsString()
  @IsOptional()
  specie: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  ageExpressedIn: string;

  @IsString()
  @IsOptional()
  sex: string;

  @IsString()
  @IsOptional()
  breed: string;

  @IsString()
  @IsOptional()
  height: string;

  @IsString()
  @IsOptional()
  weight: string;

  @IsString()
  @IsOptional()
  hair: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  colors: string[];

  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  imageUrls: string[];

  @IsBoolean()
  @IsOptional()
  hasTatoo: boolean;

  @IsBoolean()
  @IsOptional()
  hasNecklace: boolean;

  @IsString()
  @IsOptional()
  necklaceMaterial: string;

  @IsString()
  @IsOptional()
  necklaceColor: string;

  @IsBoolean()
  @IsOptional()
  hasMicrochip: boolean;

  @IsBoolean()
  @IsOptional()
  isSterilized: boolean;

  @IsOptional()
  location: ILOCATION;

  @IsString()
  @IsOptional()
  date: string;

  @IsBoolean()
  @IsOptional()
  isSuspicious: boolean;

  @IsNumber()
  @IsOptional()
  reward: number;
}
