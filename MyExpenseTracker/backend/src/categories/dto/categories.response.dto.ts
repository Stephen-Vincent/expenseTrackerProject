import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';

export class CategoryResponseDto {
  /**
   * Unique Id
   */
  id: string;

  /**
   * Name
   * @example 'John Doe'
   */
  name: string;

  /**
   * Representation color
   * @example '#efefee'
   */
  color: string;

  /**
   * Allowance for this category. Represents expected percentage of income spent on this category
   * @example 20
   */
  allowance: number | null;

  public static fromEntity(entity: CategoryEntity): CategoryResponseDto {
    return {
      id: entity._id.toString(),
      name: entity.name,
      color: entity.color,
      allowance: entity.allowance ?? null,
    };
  }
}

export class CategoryListResponseDto
  implements ListResponse<CategoryResponseDto>
{
  /**
   * List of categories
   */
  data: CategoryResponseDto[];

  public static fromEntities(
    entities: CategoryEntity[],
  ): CategoryListResponseDto {
    return {
      data: entities.map((e) => CategoryResponseDto.fromEntity(e)),
    };
  }
}
