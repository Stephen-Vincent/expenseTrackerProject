import { ExpenseEntity } from 'src/infrastructure/orm/entities/expense.entity';

export class ExpenseResponseDto {
  /** Unique id */
  id: string;

  /*
   * Description of the expense
   * @example 'pizza'
   */
  description: string;

  /**
   * Amount
   * @example 10
   * */
  amount: number;

  /**
   * Time of expense */
  loggedAt: Date;

  public static fromEntity(entity: ExpenseEntity): ExpenseResponseDto {
    return {
      id: entity._id.toString(),
      description: entity.description,
      amount: entity.amount,
      loggedAt: entity.created_at,
    };
  }
}

export class ExpenseListResponseDto
  implements ListResponse<ExpenseResponseDto>
{
  /** The list of expenses */
  data: ExpenseResponseDto[];

  public static fromEntities(
    entities: ExpenseEntity[],
  ): ExpenseListResponseDto {
    return {
      data: entities.map(ExpenseResponseDto.fromEntity),
    };
  }
}
