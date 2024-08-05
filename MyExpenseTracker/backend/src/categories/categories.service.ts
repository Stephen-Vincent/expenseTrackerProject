import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CategoryEntity } from 'src/infrastructure/orm/entities/category.entity';
import { MongoRepository } from 'typeorm';
import { PatchCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: MongoRepository<CategoryEntity>,
  ) {}

  /**
   * Query and return categories for a user
   */
  getCategoriesForUser(userId: string) {
    return this.categoryRepo.find({ where: { user_id: new ObjectId(userId) } });
  }

  /**
   * Update category allowance
   */
  async updateCategory(
    context: { userId: string; categoryId: string },
    partial: PatchCategoryDto,
  ) {
    const result = await this.categoryRepo.updateOne(
      {
        user_id: new ObjectId(context.userId),
        _id: new ObjectId(context.categoryId),
      },
      {
        $set: partial,
      },
    );
    if (result.matchedCount == 0)
      throw new NotFoundException('Category not found');
  }
}
