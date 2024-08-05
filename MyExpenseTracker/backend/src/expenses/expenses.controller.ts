import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, PatchExpenseDto } from './dto/expenses.dto';
import {
  CurrentUser,
  SessionUser,
} from 'src/infrastructure/decorators/CurrentUser';
import {
  ExpenseListResponseDto,
  ExpenseResponseDto,
} from './dto/expenses.response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { ParsedObjectIdPipe } from 'src/infrastructure/pipes/ParsedObjectIdPipe';
import { ValidationErrorResponseDto } from 'src/shared/ValidationErrorResponse.dto';

@ApiTags('expenses')
@Controller('expenses')
@ApiBearerAuth()
@UseGuards(AuthenticationGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  /**
   Log a new expense
   */
  @Post()
  @ApiCreatedResponse({
    type: ExpenseResponseDto,
    description: 'Newly logged expense',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error',
  })
  async create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: SessionUser,
  ) {
    const expense = await this.expensesService.createExpense(user.id, dto);
    return ExpenseResponseDto.fromEntity(expense);
  }

  /**
   * Get expenses for the authenticated user
   * */
  @Get()
  @ApiOkResponse({
    type: ExpenseListResponseDto,
    description: 'List of expenses',
  })
  async getExpenses(@CurrentUser() user: SessionUser) {
    const expenses = await this.expensesService.getExpensesForUser(user.id);
    return ExpenseListResponseDto.fromEntities(expenses);
  }

  /**
   * Partially update an expense
   * */
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Expense updated' })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error',
  })
  @Patch(':id')
  async updateExpense(
    @Param('id', ParsedObjectIdPipe) id: string,
    @CurrentUser() user: SessionUser,
    @Body() dto: PatchExpenseDto,
  ) {
    await this.expensesService.updateExpense(
      {
        id,
        userId: user.id,
      },
      dto,
    );
  }

  /**
   * Delete an expense
   * */
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Expense deleted' })
  @Delete(':id')
  async deleteExpense(
    @Param('id', ParsedObjectIdPipe) id: string,
    @CurrentUser() user: SessionUser,
  ) {
    await this.expensesService.deleteExpense({
      id,
      userId: user.id,
    });
  }
}
