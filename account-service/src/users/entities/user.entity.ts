import { ACCOUNT_TYPE, PROFILE_PICTURE } from '@cso-org/shared';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    length: 200,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'profile_picture',
    type: 'varchar',
    nullable: true,
  })
  profilePicture: PROFILE_PICTURE;

  @Column({ name: 'password', type: 'varchar', length: 200, nullable: false })
  password: string;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: ACCOUNT_TYPE,
    default: ACCOUNT_TYPE.USER,
    nullable: false,
  })
  accountType: ACCOUNT_TYPE;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    nullable: true,
    default: null,
  })
  refreshToken: string;

  @Column({
    name: 'is_email_verified',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isEmailVerfied: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  updatedAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('User inserted:', this);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User updated:', this);
  }

  @AfterRemove()
  logRemove() {
    console.log('User removed:', this);
  }
}
