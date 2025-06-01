import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';
import { UserEntity } from './../users/entities/user.entity';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { Roles } from './../utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult } from 'typeorm';
@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiResponse({
    status: 201,
    description:
      'The category has been successfully created.',
    type: CategoryEntity,
  })
  async create(
    @Body()
    createCategoryDto: CreateCategoryDto,
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(
      createCategoryDto,
      currentUser,
    );
  }
  @Get('all')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all categories.',
    type: [CategoryEntity],
  })
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get a single category by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the category by ID.',
    type: CategoryEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async findOne(
    @Param('id')
    id: string,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(
      +id,
    );
  }
  @Get(':id/children')
  @ApiOperation({
    summary:
      'Get all child categories of a given category ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns all child categories of the given category ID.',
    type: [CategoryEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found.',
  })
  async getChildren(
    @Param('id')
    id: string,
  ): Promise<CategoryEntity[]> {
    const category =
      await this.categoriesService.findOne(+id);
    return category.children || [];
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a category by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The category has been successfully updated.',
    type: CategoryEntity,
  })
  async update(
    @Param('id')
    id: string,
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.update(
      +id,
      updateCategoryDto,
    );
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a category by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The category has been successfully deleted.',
    type: DeleteResult,
  })
  async remove(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return await this.categoriesService.remove(
      +id,
    );
  }
}
