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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogEntity } from './entities/blog.entity';
import { Roles } from './../utility/common/user-roles.enum';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
  ) {}

  // @UseGuards(
  //   AuthenticationGuard,
  //   AuthorizeGuard([Roles.ADMIN]),
  // )
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, type: BlogEntity })
  async create(
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    return await this.blogsService.create(
      createBlogDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({
    status: 200,
    type: [BlogEntity],
  })
  async findAll(): Promise<BlogEntity[]> {
    return await this.blogsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by ID' })
  @ApiResponse({ status: 200, type: BlogEntity })
  async findOne(
    @Param('id') id: string,
  ): Promise<BlogEntity> {
    return await this.blogsService.findOne(+id);
  }

  // @UseGuards(
  //   AuthenticationGuard,
  //   AuthorizeGuard([Roles.ADMIN]),
  // )
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a blog by ID',
  })
  @ApiResponse({ status: 200, type: BlogEntity })
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntity> {
    return await this.blogsService.update(
      +id,
      updateBlogDto,
    );
  }

  // @UseGuards(
  //   AuthenticationGuard,
  //   AuthorizeGuard([Roles.ADMIN]),
  // )
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a blog by ID',
  })
  @ApiResponse({
    status: 200,
    type: DeleteResult,
  })
  async remove(
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    return await this.blogsService.remove(+id);
  }
}
