import { Alert } from 'src/alert/entities/alert.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'favorite' })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    nullable: true,
  })
  userId: string;

  @ManyToOne(() => Alert, (alert) => alert.favorites)
  alert: Alert;

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
    console.log('Favorite inserted:', this);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Favorite updated:', this);
  }

  @AfterRemove()
  logRemove() {
    console.log('Favorite removed:', this);
  }
}
