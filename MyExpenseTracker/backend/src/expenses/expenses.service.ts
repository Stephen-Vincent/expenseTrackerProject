import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExpenseDto, PatchExpenseDto } from './dto/expenses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseEntity } from 'src/infrastructure/orm/entities/expense.entity';
import { MongoRepository } from 'typeorm';
import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: MongoRepository<CategoryEntity>,

    @InjectRepository(ExpenseEntity)
    private readonly expenseRepo: MongoRepository<ExpenseEntity>,
  ) {}

  /**
   * Creates a new expense
   */
  async createExpense(userId: string, dto: CreateExpenseDto) {
    const category = await this.categoryRepo.findOne({
      where: {
        _id: new ObjectId(dto.categoryId),
        user_id: new ObjectId(userId),
      },
    });

    if (!category)
      throw new BadRequestException(
        'Category Id does not match a valid category for the user',
      );

    const result = await this.expenseRepo.insert({
      description: dto.description,
      category_id: new ObjectId(dto.categoryId),
      user_id: new ObjectId(userId),
      amount: dto.amount,
      created_at: new Date(),
    });

    return this.expenseRepo.findOne({
      where: { _id: result.identifiers[0]._id },
    });
  }

  /**
   * Query and return expenses for a user
   */
  async getExpensesForUser(userId: string) {
    return this.expenseRepo.find({ where: { user_id: new ObjectId(userId) } });
  }

  /**
   * Updates an expense
   */
  async updateExpense(
    context: { id: string; userId: string },
    partial: PatchExpenseDto,
  ) {
    const result = await this.expenseRepo.updateOne(
      {
        _id: new ObjectId(context.id),
        user_id: new ObjectId(context.userId),
      },
      {
        $set: partial,
      },
    );
    if (result.matchedCount == 0)
      throw new NotFoundException('Expense not found!');
  }

  /**
   * Deletes an expense
   */
  async deleteExpense(context: { id: string; userId: string }) {
    const result = await this.expenseRepo.deleteOne({
      _id: new ObjectId(context.id),
      user_id: new ObjectId(context.userId),
    });
    if (result.deletedCount == 0)
      throw new NotFoundException('Expense not found!');
  }
}
