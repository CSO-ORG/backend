import { ILOCATION } from '@cso-org/shared';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidLocation } from 'src/alert/validators/location.validator';

export class CreateAlert2InputDto {
  @IsString()
  @IsOptional()
  publisherId: string;

  @IsString()
  @IsOptional()
  publisherPhoneNumber: string;

  @IsString()
  @IsOptional()
  publisherEmail: string;

  @IsBoolean()
  @IsOptional()
  isFromAppUser: boolean;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
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

  @IsValidLocation()
  location: ILOCATION;

  @IsString()
  @IsOptional()
  dateTime: string;
}
