import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from './../users/entities/user.entity';
import {
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import {
  EntityManager,
  Repository,
  Timestamp,
} from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from './../products/entities/product.entity';
import { ProductsService } from './../products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enum/order-status.enum';
import { UsersService } from './../users/users.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { OrderedProductsDto } from './dto/ordered-products.dto';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { EmailsService } from './../emails/emails.service';
@Injectable()
export class OrdersService {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
    private readonly userService: UsersService,
    private readonly emailService: EmailsService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    currentUser: UserEntity,
  ): Promise<OrderEntity | null> {
    return this.manager.transaction(
      async (transactionalEntityManager) => {
        // Create and save shipping address
        const shippingEntity =
          new ShippingEntity();
        Object.assign(
          shippingEntity,
          createOrderDto.shippingAddress,
        );
        // Create order entity
        const orderEntity = new OrderEntity();
        orderEntity.shippingAddress =
          shippingEntity;
        orderEntity.user = currentUser;
        // Save order within transaction
        const orderTbl =
          await transactionalEntityManager.save(
            orderEntity,
          );
        // Prepare order-product relationships
        const opEntities: Partial<OrdersProductsEntity>[] =
          [];
        for (const productDto of createOrderDto.products) {
          const product =
            await this.productService.findOne(
              productDto.id,
            );
          // Check product availability
          if (
            product.stock <
            productDto.product_quantity
          ) {
            throw new BadRequestException(
              `Product ${product.id} is out of stock.`,
            );
          }
          // Build order-product entry
          opEntities.push({
            order: orderTbl,
            product: product,
            product_quantity:
              productDto.product_quantity,
            product_unit_price: product.price,
          });
        }
        // Save all order-product relationships
        await transactionalEntityManager.save(
          OrdersProductsEntity,
          opEntities,
        );
        // Fetch complete order with relations
        const fullOrder =
          await transactionalEntityManager.findOne(
            OrderEntity,
            {
              where: { id: orderTbl.id },
              relations: [
                'shippingAddress',
                'user',
                'products',
                'products.product',
              ],
            },
          );
        return fullOrder;
      },
    );
  }
  async findAll(
    limit: number = 10,
    offset: number = 0,
    status?:
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled',
    userId?: number,
  ): Promise<OrderEntity[]> {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (userId) whereClause.user = { id: userId };
    const orders =
      await this.orderRepository.find({
        take: limit,
        skip: offset,
        where: whereClause,
        relations: {
          shippingAddress: true,
          user: true,
          products: {
            product: true,
          },
        },
      });
    if (!orders || orders.length === 0) {
      throw new NotFoundException(
        'No orders found.',
      );
    }
    return orders;
  }
  async findOne(
    id: number,
  ): Promise<OrderEntity> {
    const order =
      await this.orderRepository.findOne({
        where: { id: id },
        relations: {
          shippingAddress: true,
          user: true,
          products: {
            product: true,
          },
        },
      });
    if (!order)
      throw new NotFoundException(
        'Order not found.',
      );
    return order;
  }
  async findOneByProductId(id: number) {
    return await this.opRepository.findOne({
      relations: {
        product: true,
      },
      where: { product: { id: id } },
    });
  }
  async update(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    // Handle no status change
    if (
      updateOrderStatusDto.status === order.status
    ) {
      return order;
    }
    // Define valid state transitions
    const allowedTransitions = {
      [OrderStatus.CART]: [
        OrderStatus.PROCESSING,
      ],
      [OrderStatus.PROCESSING]: [
        OrderStatus.SHIPPED,
        OrderStatus.CANCELLED,
      ],
      [OrderStatus.SHIPPED]: [
        OrderStatus.DELIVERED,
      ],
    };
    // Validate status transition
    if (
      !allowedTransitions[order.status]?.includes(
        updateOrderStatusDto.status,
      )
    ) {
      throw new BadRequestException(
        `Invalid status transition: ${order.status} → ${updateOrderStatusDto.status}`,
      );
    }
    // Update timestamps based on status changes
    if (
      updateOrderStatusDto.status ===
      OrderStatus.SHIPPED
    ) {
      order.shippedAt = new Date();
    } else if (
      updateOrderStatusDto.status ===
      OrderStatus.DELIVERED
    ) {
      order.deliveredAt = new Date();
    }
    // Update order properties
    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    // Save updated order
    order =
      await this.orderRepository.save(order);
    // Handle stock updates for delivered orders
    if (
      updateOrderStatusDto.status ===
      OrderStatus.DELIVERED
    ) {
      await this.stockUpdate(
        order,
        OrderStatus.DELIVERED,
      );
    }
    // 🚀 Send status change email
    const newStatus = updateOrderStatusDto.status;
    const userEmail = order.user.email;
    if (newStatus === OrderStatus.PROCESSING) {
      await this.emailService.sendOrderStatusEmail(
        userEmail,
        order.id,
        'processing',
      );
    } else if (
      newStatus === OrderStatus.SHIPPED
    ) {
      await this.emailService.sendOrderStatusEmail(
        userEmail,
        order.id,
        'shipped',
      );
    } else if (
      newStatus === OrderStatus.DELIVERED
    ) {
      await this.emailService.sendOrderStatusEmail(
        userEmail,
        order.id,
        'delivered',
      );
    }
    return order;
  }
  async cancelled(
    id: number,
    currentUser: UserEntity,
  ) {
    let order = await this.findOne(id);
    if (order.status === OrderStatus.CANCELLED)
      return order;
    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order =
      await this.orderRepository.save(order);
    await this.stockUpdate(
      order,
      OrderStatus.CANCELLED,
    );
    await this.emailService.sendOrderStatusEmail(
      order.user.email,
      order.id,
      'cancelled',
    );
    return order;
  }
  async remove(id: number) {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PROCESSING) {
      throw new BadRequestException(
        'Cannot delete non-pending orders.',
      );
    }
    await this.orderRepository.delete(id);
    return {
      message: 'Order deleted successfully.',
    };
  }
  async stockUpdate(
    order: OrderEntity,
    status: string,
  ) {
    for (const op of order.products) {
      await this.productService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }
  async getOrCreateUserCart(
    userId: number,
  ): Promise<OrderEntity> {
    let cart = await this.orderRepository.findOne(
      {
        where: {
          user: { id: userId },
          status: OrderStatus.CART,
        },
        relations: [
          'products',
          'products.product',
        ], // Include relationships
      },
    );
    if (!cart) {
      cart = new OrderEntity();
      cart.user = {
        id: userId,
      } as UserEntity; // Reference user by ID
      cart.status = OrderStatus.CART;
      cart =
        await this.orderRepository.save(cart);
    }
    cart = await this.orderRepository.findOne({
      where: { id: cart.id },
      relations: ['products', 'products.product'],
    });
    if (!cart)
      throw new NotFoundException(
        `Cart for user ${userId} could not be created.`,
      );
    return cart;
  }
  async addProductToCart(
    orderedProductsDto: OrderedProductsDto,
    currentUser: UserEntity,
  ) {
    const product =
      await this.productService.findOne(
        orderedProductsDto.id,
      );
    const cart = await this.getOrCreateUserCart(
      currentUser.id,
    );
    if (
      product.stock <
      orderedProductsDto.product_quantity
    ) {
      throw new BadRequestException(
        `Product ${product.id} is out of stock.`,
      );
    }
    // Check if product already exists in cart
    let existingProduct = cart.products.find(
      (p) =>
        p.product.id === orderedProductsDto.id,
    );
    if (existingProduct) {
      // Update quantity only
      existingProduct.product_quantity =
        orderedProductsDto.product_quantity;
      await this.opRepository.save(
        existingProduct,
      );
    } else {
      // Create new entry
      const orderedProduct =
        new OrdersProductsEntity();
      orderedProduct.order = cart;
      orderedProduct.product = product;
      orderedProduct.product_quantity =
        orderedProductsDto.product_quantity;
      orderedProduct.product_unit_price =
        product.price;
      const savedProduct =
        await this.opRepository.save(
          orderedProduct,
        );
      cart.products.push(savedProduct);
    }
    // Calculate the total price of the cart
    const totalPrice = cart.products.reduce(
      (sum, product) => {
        return (
          sum +
          product.product_unit_price *
            product.product_quantity
        );
      },
      0,
    );
    const savedCart =
      await this.orderRepository.save(cart);
    return {
      ...savedCart,
      totalPrice,
      products: savedCart.products.map(
        ({ order, ...rest }) => rest,
      ), // Remove circular ref
    };
  }
  async removeProductFromCart(
    productId: number,
    user: UserEntity,
  ) {
    // 1. Fetch cart with ordered products
    const cart = await this.getOrCreateUserCart(
      user.id,
    );
    // 2. Find the product in the cart
    const orderedProduct = cart.products.find(
      (p) => p.product.id === productId,
    );
    if (!orderedProduct) {
      throw new NotFoundException(
        'Product not found in cart',
      );
    }
    // 3. Remove the product from the orders_products table
    await this.opRepository.remove(
      orderedProduct,
    ); // This removes the relation, not the product itself
    return {
      message: 'Product removed from cart',
    };
  }
  async checkout(
    createShippingDto: CreateShippingDto,
    currentUser: UserEntity,
  ) {
    const cart = await this.getOrCreateUserCart(
      currentUser.id,
    );
    if (cart.products.length === 0) {
      throw new BadRequestException(
        'Cart is empty.',
      );
    }
    cart.status = OrderStatus.PROCESSING;
    const shipping = new ShippingEntity();
    shipping.order = cart;
    shipping.name = createShippingDto.name;
    shipping.phone = createShippingDto.phone;
    shipping.address = createShippingDto.address;
    shipping.postalCode =
      createShippingDto.postalCode;
    shipping.city = createShippingDto.city;
    shipping.state = createShippingDto.state;
    shipping.country = createShippingDto.country;
    cart.shippingAddress = shipping;
    const savedCart =
      await this.orderRepository.save(cart);
    await this.emailService.sendOrderStatusEmail(
      currentUser.email,
      cart.id,
      'processing',
    );
    // **Manually remove circular references**
    return {
      ...savedCart,
      products: savedCart.products.map(
        ({ order, ...rest }) => rest,
      ), // Removing circular reference in products
      shippingAddress: savedCart.shippingAddress
        ? {
            ...savedCart.shippingAddress,
            order: undefined, // Removing circular reference in shippingAddress
          }
        : null,
    };
  }
}
