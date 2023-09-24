import { ALERT_CATEGORY, ALERT_STATUS, ILOCATION } from '@cso-org/shared';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAlertInputDto {
  @IsString()
  @IsOptional()
  publisherPhoneNumber: string;

  @IsString()
  @IsOptional()
  publisherEmail: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsEnum(ALERT_STATUS)
  @IsOptional()
  status: string;

  @IsString()
  @IsEnum(ALERT_CATEGORY)
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
