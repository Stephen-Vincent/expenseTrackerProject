import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ nullable: true })
  allowance: number | null;

  @ObjectIdColumn()
  user_id: ObjectId;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date | null;
}
