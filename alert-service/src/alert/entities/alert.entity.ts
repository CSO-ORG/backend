import { ALERT_STATUS, ILOCATION } from '@cso-org/shared';

import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'publisher_id',
    type: 'varchar',
    nullable: true,
  })
  publisherId: string;

  @Column({
    name: 'publisher_phone_number',
    type: 'varchar',
    nullable: true,
  })
  publisherPhoneNumber: string;

  @Column({
    name: 'publisher_email',
    type: 'varchar',
    nullable: true,
  })
  publisherEmail: string;

  @Column({
    name: 'is_app_user',
    type: 'boolean',
    nullable: true,
  })
  isFromAppUser: boolean;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: true,
    default: ALERT_STATUS.IN_CREATION,
  })
  status: string;

  @Column({
    name: 'is_mod_validated',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  isModValidated: boolean;

  @Column({
    name: 'alert_type',
    type: 'varchar',
    nullable: true,
  })
  alertType: string;

  @Column({
    name: 'icad_identifier',
    type: 'varchar',
    nullable: true,
  })
  icadIdentifier: string;

  @Column({
    name: 'pet_type',
    type: 'varchar',
    nullable: true,
  })
  petType: string;

  @Column({
    name: 'specie',
    type: 'varchar',
    nullable: true,
  })
  specie: string;

  @Column({
    name: 'age',
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    name: 'age_expressed_in',
    type: 'varchar',
    nullable: true,
  })
  ageExpressedIn: string;

  @Column({
    name: 'sex',
    type: 'varchar',
    nullable: true,
  })
  sex: string;

  @Column({
    name: 'breed',
    type: 'varchar',
    nullable: true,
  })
  breed: string;

  @Column({
    name: 'height',
    type: 'varchar',
    nullable: true,
  })
  height: string;

  @Column({
    name: 'weight',
    type: 'varchar',
    nullable: true,
  })
  weight: string;

  @Column({
    name: 'hair',
    type: 'varchar',
    nullable: true,
  })
  hair: string;

  @Column({
    name: 'colors',
    type: 'simple-array',
    nullable: true,
  })
  colors: string[];

  @Column({
    name: 'image_urls',
    type: 'simple-array',
    nullable: true,
  })
  imageUrls: string[];

  @Column({
    name: 'has_tatoo',
    type: 'boolean',
    nullable: true,
  })
  hasTatoo: boolean;

  @Column({
    name: 'has_necklace',
    type: 'boolean',
    nullable: true,
  })
  hasNecklace: boolean;

  @Column({
    name: 'necklace_material',
    type: 'varchar',
    nullable: true,
  })
  necklaceMaterial: string;

  @Column({
    name: 'necklace_color',
    type: 'varchar',
    nullable: true,
  })
  necklaceColor: string;

  @Column({
    name: 'has_microchip',
    type: 'boolean',
    nullable: true,
  })
  hasMicrochip: boolean;

  @Column({
    name: 'is_castrated',
    type: 'boolean',
    nullable: true,
  })
  isSterilized: boolean;

  @Column({
    name: 'location',
    type: 'simple-json',
    nullable: true,
  })
  location: ILOCATION;

  @Column({
    name: 'date',
    type: 'varchar',
    nullable: true,
  })
  date: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: true,
  })
  updatedAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('Alert inserted:', this);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Alert updated:', this);
  }

  @AfterRemove()
  logRemove() {
    console.log('Alert removed:', this);
  }
}
