import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';

import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './../users/entities/user.entity';
import { ProductsService } from './../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productService: ProductsService,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const product =
      await this.productService.findOne(
        +createReviewDto.productId,
      );
    let review =
      await this.findOneByUserAndProduct(
        currentUser.id,
        createReviewDto.productId,
      );
    if (!review) {
      review = this.reviewRepository.create(
        createReviewDto,
      );
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return await this.reviewRepository.save(
      review,
    );
  }

  async findAllByUser(
    userId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findAllByProduct(
    id: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewRepository.find({
      where: { product: { id } },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }

  async findOne(
    id: number,
  ): Promise<ReviewEntity> {
    const review =
      await this.reviewRepository.findOne({
        where: { id: id },
        relations: {
          user: true,
          product: {
            category: true,
          },
        },
      });
    if (!review)
      throw new NotFoundException(
        'Review not found.',
      );
    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    currentUser: UserEntity,
  ) {
    const review = await this.findOne(id);
    if ((await review).user.id !== currentUser.id)
      throw new NotAcceptableException(
        'User cannot update this review as they are not its author.',
      );
    if (updateReviewDto.comment)
      (await review).comment =
        updateReviewDto.comment;
    if (updateReviewDto.ratings)
      (await review).ratings =
        updateReviewDto.ratings;
    return await this.reviewRepository.save(
      review,
    );
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }
  async findOneByUserAndProduct(
    userId: number,
    productId: number,
  ) {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: {
        user: true,
        product: {
          category: true,
        },
      },
    });
  }
}
