import { UserEntity } from 'src/infrastructure/orm/entities/user.entity';

export class AuthenticatedUserResponseDto {
  /**
   * Unique user Id
   */
  id: string;

  /**
   * Email address of the authenciated user
   * @example 'johndoe@example.com'
   */
  email: string;

  /**
   * JWT token of the authenticated user
   */
  token: string;
}

export class ProfileResponseDto {
  /**
   * Unique user Id
   */
  id: string;

  /**
   * Email address of the authenciated user
   * @example 'test@gmail.com'
   */
  email: string;

  /**
   * Name
   * @example 'John Doe'
   */
  name: string;

  /**
   * Avatar url
   * @example 'https://example.com/avatar.png'
   */
  avatarUrl: string;

  /**
   * Monthly income
   * @example 5000
   */
  monthlyIncome: number | null;

  /**
   * Currency
   * @example USD
   */
  currency: string | null;

  public static fromEntity(entity: UserEntity): ProfileResponseDto {
    return {
      id: entity._id.toString(),
      name: entity.name,
      email: entity.email,
      avatarUrl: entity.avatar_url ?? null,
      monthlyIncome: entity.monthly_income ?? null,
      currency: entity.currency ?? null,
    };
  }
}
