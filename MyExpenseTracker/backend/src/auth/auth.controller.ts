import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto/auth.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthenticatedUserResponseDto,
  ProfileResponseDto,
} from './dto/auth.response.dto';
import {
  CurrentUser,
  SessionUser,
} from 'src/infrastructure/decorators/CurrentUser';
import { AuthenticationGuard } from './auth.guard';
import { ValidationErrorResponseDto } from 'src/shared/ValidationErrorResponse.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate into the app
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AuthenticatedUserResponseDto,
    description: 'The authenticated user',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async authenticate(@Body() loginDto: LoginDto) {
    return this.authService.authenticate(loginDto);
  }

  /**
   * Create a new user account
   */
  @Post('/register')
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error',
  })
  @ApiCreatedResponse({
    type: AuthenticatedUserResponseDto,
    description: 'The newly created user account',
  })
  async createAccount(@Body() registerDto: RegisterDto) {
    return this.authService.createAccount(registerDto);
  }

  /**
   * Get profile of the authenticated uesr
   */
  @Get('/me')
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'User profile',
  })
  async getProfile(@CurrentUser() user: SessionUser) {
    const entity = await this.authService.getProfile(user.id);
    return ProfileResponseDto.fromEntity(entity);
  }

  /**
   * Update profile of the authenticated user
   */
  @Put('/me')
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'User profile',
  })
  async updateProfile(
    @CurrentUser() user: SessionUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.authService.updateProfile(user.id, dto);
    return ProfileResponseDto.fromEntity(profile);
  }
}
