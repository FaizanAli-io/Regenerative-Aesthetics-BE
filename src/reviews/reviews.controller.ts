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
  ApiProperty,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';
import { UserEntity } from './../users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { Roles } from './../utility/common/user-roles.enum';
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
  @Get('all')
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all reviews.',
    type: [ReviewEntity],
  })
  async findAll(): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAll();
  }
  @Get()
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
    @Body('productId')
    productId: number,
  ): Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(
      +productId,
    );
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
}
