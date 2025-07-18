import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { Roles } from './../utility/common/user-roles.enum';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';

import { OrderEntity } from './entities/order.entity';
import { UserEntity } from './../users/entities/user.entity';

import {
  CreateCartDto,
  CreateOrderDto,
  CreateShippingDto,
  OrderedProductsDto,
  CreateGuestOrderDto,
  UpdateOrderStatusDto,
  UpdateCartQuantityDto,
} from './dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}
  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description:
      'The order has been successfully created.',
    type: OrderEntity,
  })
  async create(
    @Body()
    createOrderDto: CreateOrderDto,
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<OrderEntity | null> {
    return await this.ordersService.create(
      createOrderDto,
      currentUser,
    );
  }

  @Post('guest')
  @ApiOperation({
    summary:
      'Create a new guest order (no authentication required)',
  })
  @ApiResponse({
    status: 201,
    description:
      'The guest order has been successfully created.',
    type: OrderEntity,
  })
  async createGuestOrder(
    @Body()
    createGuestOrderDto: CreateGuestOrderDto,
  ): Promise<OrderEntity | null> {
    return await this.ordersService.createGuestOrder(
      createGuestOrderDto,
    );
  }

  @Get('all')
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all orders (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of orders.',
    type: [OrderEntity],
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Admin access required.',
  })
  async findAll(
    @Query('limit')
    limit: number,
    @Query('offset')
    offset: number,
    @Query('status')
    status?:
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled',
  ): Promise<OrderEntity[]> {
    return await this.ordersService.findAll(
      limit,
      offset,
      status,
    );
  }

  @Get()
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.USER]),
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get your own orders',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns your own orders.',
    type: [OrderEntity],
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. User access required.',
  })
  async findMyOrders(
    @CurrentUser()
    currentUser: UserEntity,
    @Query('limit')
    limit: number,
    @Query('offset')
    offset: number,
    @Query('status')
    status?:
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled',
  ): Promise<OrderEntity[]> {
    return await this.ordersService.findAll(
      limit,
      offset,
      status,
      currentUser.id,
    );
  }
  @Get(':id')
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.USER]),
  )
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get an order by ID (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the order details.',
    type: OrderEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<OrderEntity> {
    return await this.ordersService.findOne(id);
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an order status',
  })
  @ApiResponse({
    status: 200,
    description:
      'The order status has been successfully updated.',
    type: OrderEntity,
  })
  async update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.ordersService.update(
      id,
      updateOrderStatusDto,
      currentUser,
    );
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Put('cancel/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel an order by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The order has been successfully cancelled.',
    type: OrderEntity,
  })
  async cancelledOrder(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.ordersService.cancelled(
      id,
      currentUser,
    );
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an order by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The order has been successfully deleted.',
    type: OrderEntity,
  })
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return await this.ordersService.remove(id);
  }
  @UseGuards(AuthenticationGuard)
  @Get('cart/mine')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user’s cart',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the current user’s cart.',
    type: CreateCartDto,
  })
  async getCart(
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return this.ordersService.getOrCreateUserCart(
      currentUser.id,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Post('cart')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a product to the cart',
  })
  @ApiResponse({
    status: 201,
    description:
      'The product has been successfully added to the cart.',
    type: OrderedProductsDto,
  })
  async addProductToCart(
    @Body()
    orderedProductsDto: OrderedProductsDto,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.ordersService.addProductToCart(
      orderedProductsDto,
      currentUser,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Delete('cart/remove/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove a product from the cart',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product has been successfully removed from the cart.',
  })
  async removeProductFromCart(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return this.ordersService.removeProductFromCart(
      id,
      currentUser,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Patch('cart/quantity')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update quantity of a product in the cart',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product quantity has been successfully updated in the cart.',
  })
  async updateCartQuantity(
    @Body()
    updateCartQuantityDto: UpdateCartQuantityDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.ordersService.updateCartQuantity(
      updateCartQuantityDto.productId,
      updateCartQuantityDto.quantity,
      currentUser,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Post('cart/checkout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout the cart' })
  @ApiResponse({
    status: 201,
    description:
      'The cart has been successfully checked out.',
  })
  async checkout(
    @Body()
    createShippingDto: CreateShippingDto,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.ordersService.checkout(
      createShippingDto,
      currentUser,
    );
  }
}
