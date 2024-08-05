import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class ExpenseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @ObjectIdColumn()
  category_id: ObjectId;

  @ObjectIdColumn()
  user_id: ObjectId;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date | null;
}
