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
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAlertInputDto {
  @ApiProperty({
    type: String,
    description: "publisher's phone number",
    default: '+33000000',
  })
  @IsString()
  @IsOptional()
  publisherPhoneNumber: string;

  @ApiProperty({
    type: String,
    description: "publisher's email",
    default: 'johndoe@xxx.xx',
  })
  @IsString()
  @IsOptional()
  publisherEmail: string;

  @ApiProperty({
    type: String,
    description: 'the name of the pet',
    default: 'trump',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    description: 'the description of the alert',
    default: 'some random description about my lost pet',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: String,
    description: 'the status of the alert',
    default: ALERT_STATUS.IN_CREATION,
  })
  @IsString()
  @IsEnum(ALERT_STATUS)
  @IsOptional()
  status: string;

  @ApiProperty({
    type: String,
    description: 'the category of the alert',
    default: ALERT_CATEGORY.LOST_PET,
  })
  @IsString()
  @IsEnum(ALERT_CATEGORY)
  @IsOptional()
  alertType: string;

  @ApiProperty({
    type: String,
    description: 'the icad identifier of the pet',
    default: '123456',
  })
  @IsString()
  @IsOptional()
  icadIdentifier: string;

  @ApiProperty({
    type: String,
    description: 'the type of pet',
    default: PET_CATEGORY.DOG,
  })
  @IsString()
  @IsOptional()
  petType: string;

  @ApiProperty({
    type: String,
    description: 'the pet specie',
    default: 'german sheperd',
  })
  @IsString()
  @IsOptional()
  specie: string;

  @ApiProperty({
    type: Number,
    description: 'the age of the pet',
    default: 4,
  })
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty({
    type: String,
    description: 'age format expression',
    default: AGE_EXPRESSED_IN.YEAR,
  })
  @IsString()
  @IsOptional()
  ageExpressedIn: string;

  @ApiProperty({
    type: String,
    description: 'the sex category of the pet',
    default: SEX_CATEGORY.MALE,
  })
  @IsString()
  @IsOptional()
  sex: string;

  @ApiProperty({
    type: String,
    description: "the pet's breed",
    default: 'west german working line german shepherd',
  })
  @IsString()
  @IsOptional()
  breed: string;

  @ApiProperty({
    type: String,
    description: 'the height category of the pet',
    default: HEIGHT_CATEGORY.SHORT,
  })
  @IsString()
  @IsOptional()
  height: string;

  @ApiProperty({
    type: String,
    description: 'the weight category of the pet',
    default: WEIGHT_CATEGORY.PLUMP,
  })
  @IsString()
  @IsOptional()
  weight: string;

  @ApiProperty({
    type: String,
    description: "pet's hair type",
    default: HAIR_TYPE.LONG,
  })
  @IsString()
  @IsOptional()
  hair: string;

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
    default: NECKLACE_MATERIAL_CATEGORY.CHAIN,
  })
  @IsString()
  @IsOptional()
  necklaceMaterial: string;

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
      coords: {
        latitude: 0,
        longitude: 0,
      },
    },
  })
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

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet is suspicious or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isSuspicious: boolean;

  @ApiProperty({
    type: Number,
    description: 'whether the pet is suspicious or not',
    default: 123.11,
  })
  @IsNumber()
  @IsOptional()
  reward: number;
}
