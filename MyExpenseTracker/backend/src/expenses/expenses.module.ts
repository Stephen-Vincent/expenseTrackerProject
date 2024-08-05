import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';
import { ExpenseEntity } from 'src/infrastructure/orm/entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ExpenseEntity])],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
