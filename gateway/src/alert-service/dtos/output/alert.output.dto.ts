import {
  AGE_EXPRESSED_IN,
  ALERT_CATEGORY,
  ALERT_STATUS,
  HAIR_TYPE,
  HEIGHT_CATEGORY,
  ILOCATION,
  NECKLACE_CATEGORY,
  PET_CATEGORY,
  SEX_CATEGORY,
  WEIGHT_CATEGORY,
} from '@cso-org/shared';
import { ApiProperty } from '@nestjs/swagger';

export class AlertOutputDto {
  @ApiProperty({
    type: String,
    description: "alert's id",
    default: '12323123123',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: "alert's publisher ID",
    default: 'some.random.user.id',
  })
  publisherId: string;

  @ApiProperty({
    type: String,
    description: "publisher's phone number",
    default: '+33000000',
  })
  publisherPhoneNumber: string;

  @ApiProperty({
    type: String,
    description: "publisher's email",
    default: 'johndoe@xxx.xx',
  })
  publisherEmail: string;

  @ApiProperty({
    type: Boolean,
    description: 'whether the user already has an account or not yet',
    default: false,
  })
  isFromAppUser: boolean;

  @ApiProperty({
    type: String,
    description: 'the name of the pet',
    default: 'trump',
  })
  name: string;

  @ApiProperty({
    type: String,
    description: 'the description of the alert',
    default: 'some random description about my lost pet',
  })
  description: string;

  @ApiProperty({
    type: String,
    description: 'the status of the alert',
    enum: ALERT_STATUS,
    default: ALERT_STATUS.PUBLISHED,
  })
  status: ALERT_STATUS;

  @ApiProperty({
    type: Boolean,
    description: 'whether alert has been validated by moderator or not',
    default: false,
  })
  isModValidated: boolean;

  @ApiProperty({
    type: String,
    description: 'the category of the alert',
    enum: ALERT_CATEGORY,
    default: ALERT_CATEGORY.LOST_PET,
  })
  alertType: ALERT_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the icad identifier of the pet',
    default: '123456',
  })
  icadIdentifier: string;

  @ApiProperty({
    type: String,
    description: 'the type of pet',
    enum: PET_CATEGORY,
    default: PET_CATEGORY.DOG,
  })
  petType: PET_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the pet specie',
    default: 'german sheperd',
  })
  specie: string;

  @ApiProperty({
    type: Number,
    description: 'the age of the pet',
    default: 4,
  })
  age: number;

  @ApiProperty({
    type: String,
    description: 'age format expression',
    enum: AGE_EXPRESSED_IN,
    default: AGE_EXPRESSED_IN.YEAR,
  })
  ageExpressedIn: AGE_EXPRESSED_IN;

  @ApiProperty({
    type: String,
    description: 'the sex category of the pet',
    enum: SEX_CATEGORY,
    default: SEX_CATEGORY.MALE,
  })
  sex: SEX_CATEGORY;

  @ApiProperty({
    type: String,
    description: "the pet's breed",
    default: 'west german working line german shepherd',
  })
  breed: string;

  @ApiProperty({
    type: String,
    description: 'the height category of the pet',
    enum: HEIGHT_CATEGORY,
    default: HEIGHT_CATEGORY.SHORT,
  })
  height: HEIGHT_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the weight category of the pet',
    enum: WEIGHT_CATEGORY,
    default: WEIGHT_CATEGORY.PLUMP,
  })
  weight: WEIGHT_CATEGORY;

  @ApiProperty({
    type: String,
    description: "pet's hair type",
    enum: HAIR_TYPE,
    default: HAIR_TYPE.LONG,
  })
  hair: HAIR_TYPE;

  @ApiProperty({
    type: Array<string>,
    description: "the pet's hair colors",
    default: ['brown', 'yellow'],
  })
  colors: string[];

  @ApiProperty({
    type: String,
    description: "the alert's pictures",
    default: ['https://csopetfinder.com'],
  })
  imageUrls: string[];

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has tatoo or not',
    default: false,
  })
  hasTatoo: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has necklace or not',
    default: false,
  })
  hasNecklace: boolean;

  @ApiProperty({
    type: String,
    description: 'the category of necklace material of the pet',
    enum: NECKLACE_CATEGORY,
    default: NECKLACE_CATEGORY.CHOKE_CHAIN,
  })
  necklaceMaterial: NECKLACE_CATEGORY;

  @ApiProperty({
    type: String,
    description: 'the color of the necklace',
    default: 'https://csopetfinder.com',
  })
  necklaceColor: string;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet has microchip or not',
    default: false,
  })
  hasMicrochip: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'whether the pet is castrated or not',
    default: false,
  })
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
  location: ILOCATION;

  @ApiProperty({
    type: String,
    description: 'the loss date and time',
    default: '01/01/2023',
  })
  date: string;

  @ApiProperty({
    type: Date,
    description: 'the creation date',
    default: '01/01/2023',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'the last update date',
    default: '01/01/2023',
  })
  updatedAt: Date;
}
