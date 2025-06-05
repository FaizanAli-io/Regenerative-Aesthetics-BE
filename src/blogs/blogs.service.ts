import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeleteResult,
} from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
  ) {}

  async create(
    createBlogDto: CreateBlogDto,
  ): Promise<BlogEntity> {
    const blog = this.blogRepository.create({
      ...createBlogDto,
    });
    return await this.blogRepository.save(blog);
  }

  async findAll(): Promise<BlogEntity[]> {
    return await this.blogRepository.find();
  }

  async findOne(id: number): Promise<BlogEntity> {
    const blog =
      await this.blogRepository.findOne({
        where: { id },
      });
    if (!blog)
      throw new NotFoundException(
        'Blog not found',
      );
    return blog;
  }

  async update(
    id: number,
    dto: UpdateBlogDto,
  ): Promise<BlogEntity> {
    const blog = await this.findOne(id);
    Object.assign(blog, dto);
    return await this.blogRepository.save(blog);
  }

  async remove(
    id: number,
  ): Promise<DeleteResult> {
    return await this.blogRepository.delete(id);
  }
}
