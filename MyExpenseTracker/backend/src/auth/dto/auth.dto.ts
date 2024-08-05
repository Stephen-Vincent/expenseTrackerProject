import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  /**
   * Email address of the authenticating user
   */
  @IsEmail()
  email: string;

  /**
   * Password of the authenticating user
   */
  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDto {
  /**
   * Name
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Email address
   */
  @IsEmail()
  email: string;

  /**
   * Password
   */
  @IsString()
  @MinLength(4)
  password: string;
}

export class UpdateProfileDto {
  /**
   * name
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Avatar url
   * @example 'https://example.com/logo.png'
   */
  @IsString()
  @IsOptional()
  avatarUrl: string;

  /**
   * Monthly
   */
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  monthlyIncome: number;

  /**
   * Currency
   */
  @IsString()
  @IsNotEmpty()
  currency: string;
}
