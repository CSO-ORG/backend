import {
  AGE_EXPRESSED_IN,
  ALERT_CATEGORY,
  ALERT_STATUS,
  HAIR_TYPE,
  HEIGHT_CATEGORY,
  ILOCATION,
  NECKLACE_MATERIAL_CATEGORY,
  PET_CATEGORY,
  SEX_CATEGORY,
  WEIGHT_CATEGORY,
} from '@cso-org/shared';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IsEmailRequired } from 'src/alert/validators/email-required.validator';
import { IsValidLocation } from 'src/alert/validators/location.validator';
import { IsNameRequired } from 'src/alert/validators/name-required.validator';
import { IsPhoneNumberRequired } from 'src/alert/validators/phone-number-required.validator';

export class UpdateAlertInputDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  publisherId: string;

  @IsPhoneNumberRequired()
  @IsOptional()
  publisherPhoneNumber: string;

  @IsEmailRequired()
  @IsOptional()
  publisherEmail: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isFromAppUser: boolean;

  @IsNameRequired()
  @IsOptional()
  name: string;

  @IsString()
  @MaxLength(30000)
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsEnum(ALERT_STATUS)
  @IsNotEmpty()
  @IsOptional()
  status: ALERT_STATUS;

  @IsEnum(ALERT_CATEGORY)
  @IsNotEmpty()
  @IsOptional()
  alertType: ALERT_CATEGORY;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @IsOptional()
  icadIdentifier: string;

  @IsEnum(PET_CATEGORY)
  @IsNotEmpty()
  @IsOptional()
  petType: PET_CATEGORY;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  specie: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  age: number;

  @IsEnum(AGE_EXPRESSED_IN)
  @IsOptional()
  ageExpressedIn: AGE_EXPRESSED_IN;

  @IsEnum(SEX_CATEGORY)
  @IsOptional()
  sex: SEX_CATEGORY;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  breed: string;

  @IsEnum(HEIGHT_CATEGORY)
  @IsOptional()
  height: HEIGHT_CATEGORY;

  @IsEnum(WEIGHT_CATEGORY)
  @IsOptional()
  weight: WEIGHT_CATEGORY;

  @IsEnum(HAIR_TYPE)
  @IsOptional()
  hair: HAIR_TYPE;

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

  @IsEnum(NECKLACE_MATERIAL_CATEGORY)
  @IsOptional()
  necklaceMaterial: NECKLACE_MATERIAL_CATEGORY;

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
  @IsOptional()
  location: ILOCATION;

  @IsString()
  @IsOptional()
  date: string;
}
