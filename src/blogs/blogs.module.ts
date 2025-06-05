import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
