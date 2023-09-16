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
import { ApiProperty } from '@nestjs/swagger';
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
import { IsEmailRequired } from 'src/alert-service/validators/email-required.validator';
import { IsValidLocation } from 'src/alert-service/validators/location.validator';
import { IsNameRequired } from 'src/alert-service/validators/name-required.validator';
import { IsPhoneNumberRequired } from 'src/alert-service/validators/phone-number-required.validator';

export class UpdateAlertInputDto {
  @ApiProperty({
    type: String,
    description: "alert's publisher ID",
    default: 'some.random.user.id',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  publisherId: string;

  @ApiProperty({
    type: String,
    description: "publisher's phone number",
    default: '+33000000',
  })
  @IsPhoneNumberRequired()
  @IsOptional()
  publisherPhoneNumber: string;

  @ApiProperty({
    type: String,
    description: "publisher's email",
    default: 'johndoe@xxx.xx',
  })
  @IsEmailRequired()
  @IsOptional()
  publisherEmail: string;

  @ApiProperty({
    type: Boolean,
    description: 'whether the user already has an account or not yet',
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isFromAppUser: boolean;

  @ApiProperty({
    type: String,
    description: 'the name of the pet',
    default: 'trump',
  })
  @IsNameRequired()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    description: 'the description of the alert',
    default: 'some random description about my lost pet',
  })
  @IsString()
  @MaxLength(30000)
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: String,
    description: 'the status of the alert',
    enum: ALERT_STATUS,
    default: ALERT_STATUS.PUBLISHED,
  })
  @IsEnum(ALERT_STATUS)
  @IsNotEmpty()
  @IsOptional()
  status: ALERT_STATUS;

  @ApiProperty({
    type: String,
    description: 'the category of the alert',
    enum: ALERT_CATEGORY,
    default: ALERT_CATEGORY.LOST_PET,
  })
  @IsEnum(ALERT_CATEGORY)
  @IsNotEmpty()
  @IsOptional()
  alertType: ALERT_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the icad identifier of the pet',
    default: '123456',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @IsOptional()
  icadIdentifier: string;

  @ApiProperty({
    type: String,
    description: 'the type of pet',
    enum: PET_CATEGORY,
    default: PET_CATEGORY.DOG,
  })
  @IsEnum(PET_CATEGORY)
  @IsNotEmpty()
  @IsOptional()
  petType: PET_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the pet specie',
    default: 'german sheperd',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  specie: string;

  @ApiProperty({
    type: Number,
    description: 'the age of the pet',
    default: 4,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  age: number;

  @ApiProperty({
    type: String,
    description: 'age format expression',
    enum: AGE_EXPRESSED_IN,
    default: AGE_EXPRESSED_IN.YEAR,
  })
  @IsEnum(AGE_EXPRESSED_IN)
  @IsOptional()
  ageExpressedIn: AGE_EXPRESSED_IN;

  @ApiProperty({
    type: String,
    description: 'the sex category of the pet',
    enum: SEX_CATEGORY,
    default: SEX_CATEGORY.MALE,
  })
  @IsEnum(SEX_CATEGORY)
  @IsOptional()
  sex: SEX_CATEGORY;

  @ApiProperty({
    type: String,
    description: "the pet's breed",
    default: 'west german working line german shepherd',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  breed: string;

  @ApiProperty({
    type: String,
    description: 'the height category of the pet',
    enum: HEIGHT_CATEGORY,
    default: HEIGHT_CATEGORY.SHORT,
  })
  @IsEnum(HEIGHT_CATEGORY)
  @IsOptional()
  height: HEIGHT_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the weight category of the pet',
    enum: WEIGHT_CATEGORY,
    default: WEIGHT_CATEGORY.PLUMP,
  })
  @IsEnum(WEIGHT_CATEGORY)
  @IsOptional()
  weight: WEIGHT_CATEGORY;

  @ApiProperty({
    type: String,
    description: "pet's hair type",
    enum: HAIR_TYPE,
    default: HAIR_TYPE.LONG,
  })
  @IsEnum(HAIR_TYPE)
  @IsOptional()
  hair: HAIR_TYPE;

  @ApiProperty({
    type: Array<string>,
    description: "the pet's hair colors",
    default: ['brown', 'yellow'],
  })
  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  colors: string[];

  @ApiProperty({
    type: String,
    description: "the alert's pictures",
    default: ['https://csopetfinder.com'],
  })
  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  imageUrls: string[];

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has tatoo or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasTatoo: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has necklace or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasNecklace: boolean;

  @ApiProperty({
    type: String,
    description: 'the category of necklace material of the pet',
    enum: NECKLACE_MATERIAL_CATEGORY,
    default: NECKLACE_MATERIAL_CATEGORY.CHAIN,
  })
  @IsEnum(NECKLACE_MATERIAL_CATEGORY)
  @IsOptional()
  necklaceMaterial: NECKLACE_MATERIAL_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the color of the necklace',
    default: 'https://csopetfinder.com',
  })
  @IsString()
  @IsOptional()
  necklaceColor: string;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has microchip or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hasMicrochip: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet is castrated or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSterilized: boolean;

  @ApiProperty({
    type: String,
    description: 'the last location of the pet',
    default: {
      country: 'France',
      city: 'Nantes',
      address: 'random address',
      postalCode: '44000',
      departmentName: 'Nantes',
      departmentCode: '44',
    },
  })
  @IsValidLocation()
  @IsOptional()
  location: ILOCATION;

  @ApiProperty({
    type: String,
    description: 'found or loss date time',
    default: '01/01/2023',
  })
  @IsString()
  @IsOptional()
  date: string;
}
