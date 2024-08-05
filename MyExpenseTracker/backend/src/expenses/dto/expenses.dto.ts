import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  /** Description of the expense */
  @IsString()
  @IsOptional()
  description?: string;

  /** Amount of the expense */
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  amount: number;

  /** Expense category Id */
  @IsMongoId()
  categoryId: string;
}

export class PatchExpenseDto extends PartialType(
  PickType(CreateExpenseDto, ['description', 'amount']),
) {}
