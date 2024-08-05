import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import {
  CurrentUser,
  SessionUser,
} from 'src/infrastructure/decorators/CurrentUser';
import { CategoryListResponseDto } from './dto/categories.response.dto';
import { ParsedObjectIdPipe } from 'src/infrastructure/pipes/ParsedObjectIdPipe';
import { ObjectId } from 'typeorm';
import { PatchCategoryDto } from './dto/categories.dto';
import { ValidationErrorResponseDto } from 'src/shared/ValidationErrorResponse.dto';

@ApiBearerAuth()
@ApiTags('categories')
@UseGuards(AuthenticationGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Get categories for the authenticated user
   */
  @Get()
  async getUserCategories(@CurrentUser() user: SessionUser) {
    const categories = await this.categoriesService.getCategoriesForUser(
      user.id,
    );
    return CategoryListResponseDto.fromEntities(categories);
  }

  /**
   * Partially update a category
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Category updated' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error',
  })
  @Patch(':id')
  async patchCategory(
    @Param('id', ParsedObjectIdPipe) id: string,
    @CurrentUser() user: SessionUser,
    @Body() dto: PatchCategoryDto,
  ) {
    await this.categoriesService.updateCategory(
      {
        userId: user.id,
        categoryId: id,
      },
      dto,
    );
  }
}
