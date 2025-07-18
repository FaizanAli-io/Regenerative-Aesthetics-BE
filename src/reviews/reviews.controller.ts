// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
// } from '@nestjs/common';
// import { ReviewsService } from './reviews.service';
// import { CreateReviewDto } from './dto/create-review.dto';
// import { UpdateReviewDto } from './dto/update-review.dto';
// import { AuthenticationGuard } from 'src/utility/common/guards/authentication.guard';
// import { CurrentUser } from 'src/utility/common/decorators/current-user.decorator';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { ReviewEntity } from './entities/review.entity';
// import { get } from 'http';
// import { AuthorizeGuard } from 'src/utility/common/guards/authorization.guard';
// import { Roles } from 'src/utility/common/user-roles.enum';
// @Controller('reviews')
// export class ReviewsController {
//   constructor(
//     private readonly reviewsService: ReviewsService,
//   ) {}
//   @UseGuards(AuthenticationGuard)
//   @Post()
//   async create(
//     @Body() createReviewDto: CreateReviewDto,
//     @CurrentUser() currentUser: UserEntity,
//   ): Promise<ReviewEntity> {
//     return await this.reviewsService.create(
//       createReviewDto,
//       currentUser,
//     );
//   }
//   @Get('all')
//   async findAll(): Promise<ReviewEntity[]> {
//     return await this.reviewsService.findAll();
//   }
//   @Get()
//   async findAllByProduct(
//     @Body('productId') productId: number,
//   ): Promise<ReviewEntity[]> {
//     return await this.reviewsService.findAllByProduct(
//       +productId,
//     );
//   }
//   @Get(':id')
//   async findOne(
//     @Param('id') id: string,
//   ): Promise<ReviewEntity> {
//     return await this.reviewsService.findOne(+id);
//   }
//   @UseGuards(AuthenticationGuard)
//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateReviewDto: UpdateReviewDto,
//     @CurrentUser() currentUser: UserEntity,
//   ) {
//     return this.reviewsService.update(
//       +id,
//       updateReviewDto,
//       currentUser,
//     );
//   }
//   @UseGuards(
//     AuthenticationGuard,
//     AuthorizeGuard([Roles.ADMIN]),
//   )
//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.reviewsService.remove(+id);
//   }
// }

import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ReviewsService } from './reviews.service';
import { ReviewEntity } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

import { UserEntity } from './../users/entities/user.entity';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';

import { Roles } from './../utility/common/user-roles.enum';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
  ) {}
  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new review',
  })
  @ApiResponse({
    status: 201,
    description:
      'The review has been successfully created.',
    type: ReviewEntity,
  })
  async create(
    @Body()
    createReviewDto: CreateReviewDto,
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.create(
      createReviewDto,
      currentUser,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Get('')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all reviews of the current user',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns all reviews created by the current user.',
    type: [ReviewEntity],
  })
  async findAllByCurrentUser(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByUser(
      currentUser.id,
    );
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all reviews of all users',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of all reviews from all users.',
    type: [ReviewEntity],
  })
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the review details.',
    type: ReviewEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  async findOne(
    @Param('id')
    id: string,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a review by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The review has been successfully updated.',
    type: ReviewEntity,
  })
  async update(
    @Param('id')
    id: string,
    @Body()
    updateReviewDto: UpdateReviewDto,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return this.reviewsService.update(
      +id,
      updateReviewDto,
      currentUser,
    );
  }

  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a review by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The review has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found.',
  })
  async remove(
    @Param('id')
    id: string,
  ) {
    return this.reviewsService.remove(+id);
  }

  @Get('product/:id')
  @ApiOperation({
    summary: 'Get reviews by product ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns reviews for a specific product.',
    type: [ReviewEntity],
  })
  async findAllByProduct(
    @Param('id')
    productId: string,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(
      +productId,
    );
  }
}
