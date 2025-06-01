import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import {
  DeleteResult,
  IsNull,
  Repository,
} from 'typeorm';
import { UserEntity } from './../users/entities/user.entity';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    let parentCategory: CategoryEntity | null =
      null;
    if (createCategoryDto.parentCategoryId) {
      parentCategory = await this.findOne(
        createCategoryDto.parentCategoryId,
      );
    }
    const category = new CategoryEntity();
    category.title = createCategoryDto.title;
    category.description =
      createCategoryDto.description;
    category.addedBy = currentUser;
    if (parentCategory) {
      category.parentCategory = parentCategory;
    }
    return await this.categoryRepository.save(
      category,
    );
  }
  async findAll(): Promise<CategoryEntity[]> {
    const categories =
      await this.categoryRepository.find({
        where: {
          parentCategory: IsNull(), // Correctly checks if the relation is absent
        },
        relations: ['children'], // Load nested children
      });
    return this.buildCategoryTree(categories);
  }
  // Helper method remains unchanged
  private buildCategoryTree(
    categories: CategoryEntity[],
  ): CategoryEntity[] {
    categories.forEach((category) => {
      if (category.children?.length) {
        category.children =
          this.buildCategoryTree(
            category.children,
          );
      }
    });
    return categories;
  }
  async getCategoryAndChildrenIds(
    categoryId: number,
  ): Promise<number[]> {
    const category =
      await this.findOne(categoryId);
    const childIds: number[] = category.children
      ? category.children.map((child) => child.id)
      : [];
    for (const child of category.children) {
      const grandChildIds =
        await this.getCategoryAndChildrenIds(
          child.id,
        );
      childIds.push(...grandChildIds);
    }
    return [categoryId, ...childIds]; // Include the original category ID too
  }
  async findOne(
    id: number,
  ): Promise<CategoryEntity> {
    const category =
      await this.categoryRepository.findOne({
        where: { id: id },
        relations: ['parentCategory', 'children'], // Load parent and children
      });
    if (!category) {
      throw new NotFoundException(
        'Category not found.',
      );
    }
    return category;
  }
  async update(
    id: number,
    fields: Partial<UpdateCategoryDto>,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (fields.parentCategoryId !== undefined) {
      if (fields.parentCategoryId === null) {
        category.parentCategory = null; // ✅ Works now
      } else {
        if (fields.parentCategoryId === id) {
          throw new BadRequestException(
            'A category cannot be its own parent.',
          );
        }
        const parentCategory =
          await this.categoryRepository.findOne({
            where: {
              id: fields.parentCategoryId,
            },
            relations: ['parentCategory'],
          });
        if (!parentCategory) {
          throw new NotFoundException(
            'Parent category not found.',
          );
        }
        // Check for circular dependency
        let currentParent: CategoryEntity | null =
          parentCategory;
        while (currentParent) {
          if (currentParent.id === id) {
            throw new BadRequestException(
              'Circular category hierarchy is not allowed.',
            );
          }
          currentParent =
            currentParent.parentCategory ?? null;
        }
        category.parentCategory = parentCategory;
      }
    }
    Object.assign(category, fields);
    return await this.categoryRepository.save(
      category,
    );
  }
  async remove(
    id: number,
  ): Promise<DeleteResult> {
    const result =
      await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        'Category not found',
      );
    }
    return result;
  }
}
