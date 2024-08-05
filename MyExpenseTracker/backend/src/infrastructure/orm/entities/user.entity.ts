import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  currency: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar_url: string | null;

  @Column({ nullable: true })
  monthly_income: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date | null;
}
