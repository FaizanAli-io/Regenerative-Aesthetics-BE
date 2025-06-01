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
}
