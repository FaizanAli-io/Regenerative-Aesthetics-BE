import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Query,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { UserEntity } from './../users/entities/user.entity';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';

@ApiTags('Wishlists')
@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
  ) {}
  @UseGuards(AuthenticationGuard)
  @Post('add')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a product to the wishlist',
  })
  @ApiResponse({
    status: 201,
    description:
      'The product has been successfully added to the wishlist.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Product already in the wishlist.',
  })
  async addToWishlist(
    @CurrentUser()
    currentUser: UserEntity,
    @Body('productId', ParseIntPipe)
    productId: number,
  ) {
    return await this.wishlistsService.addToWishlist(
      currentUser.id,
      productId,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Get all products in the user's wishlist",
  })
  @ApiResponse({
    status: 200,
    description:
      "Returns a list of products in the user's wishlist.",
  })
  @ApiResponse({
    status: 404,
    description:
      'No products found in the wishlist.',
  })
  async getUserWishlist(
    @CurrentUser()
    currentUser: UserEntity,
    @Query()
    query: any,
  ) {
    return await this.wishlistsService.getUserWishlist(
      currentUser.id,
      query,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Delete('remove/:productId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a product from the wishlist',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product has been successfully removed from the wishlist.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Product not found in the wishlist.',
  })
  async removeFromWishlist(
    @CurrentUser()
    currentUser: UserEntity,
    @Param('productId', ParseIntPipe)
    productId: number,
  ) {
    return await this.wishlistsService.removeFromWishlist(
      currentUser.id,
      productId,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Get('check/:productId')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Check if a product is in the wishlist',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns whether the product is in the wishlist.',
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async checkIfWishlisted(
    @CurrentUser()
    currentUser: UserEntity,
    @Param('productId', ParseIntPipe)
    productId: number,
  ) {
    return await this.wishlistsService.checkIfWishlisted(
      currentUser.id,
      productId,
    );
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all users wishlists (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of all users wishlists.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Admin access required.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description:
      'Number of items to return per page (default: 10)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description:
      'Number of items to skip for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search term to filter by product title or user email',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description:
      'Filter wishlists for a specific user ID',
  })
  async getAllUsersWishlists(
    @Query()
    query: any,
  ) {
    return await this.wishlistsService.getAllUsersWishlists(
      query,
    );
  }
}
