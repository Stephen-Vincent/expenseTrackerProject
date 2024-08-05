import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PatchCategoryDto {
  /**
   * Name of the category
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * Color representation for this category
   */
  @IsString()
  @IsOptional()
  color?: string;

  /**
   * Allowance for this category (in percentage)
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  allowance?: number;
}
