// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Query,
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { CurrentUser } from 'src/utility/common/decorators/current-user.decorator';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { AuthenticationGuard } from 'src/utility/common/guards/authentication.guard';
// import { AuthorizeGuard } from 'src/utility/common/guards/authorization.guard';
// import { Roles } from 'src/utility/common/user-roles.enum';
// import { ProductEntity } from './entities/product.entity';
// import { DeleteResult } from 'typeorm';
// import { SerializeIncludes } from 'src/utility/common/interceptors/serialize.interceptor';
// import { ProductsDto } from './dto/products.dto';
// @Controller('products')
// export class ProductsController {
//   constructor(
//     private readonly productsService: ProductsService,
//   ) {}
//   @UseGuards(
//     AuthenticationGuard,
//     AuthorizeGuard([Roles.ADMIN]),
//   )
//   @Post()
//   async create(
//     @Body() createProductDto: CreateProductDto,
//     @CurrentUser() currentUser: UserEntity,
//   ): Promise<ProductEntity> {
//     return await this.productsService.create(
//       createProductDto,
//       currentUser,
//     );
//   }
//   @SerializeIncludes(ProductsDto)
//   @Get('all')
//   async findAll(
//     @Query() query: any,
//   ): Promise<ProductsDto> {
//     return await this.productsService.findAll(
//       query,
//     );
//   }
//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return await this.productsService.findOne(
//       +id,
//     );
//   }
//   @UseGuards(
//     AuthenticationGuard,
//     AuthorizeGuard([Roles.ADMIN]),
//   )
//   @Patch(':id')
//   async update(
//     @Param('id') id: string,
//     @Body() updateProductDto: UpdateProductDto,
//     @CurrentUser() currentUser: UserEntity,
//   ): Promise<ProductEntity> {
//     return await this.productsService.update(
//       +id,
//       updateProductDto,
//       currentUser,
//     );
//   }
//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return await this.productsService.remove(+id);
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
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';
import { UserEntity } from './../users/entities/user.entity';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { Roles } from './../utility/common/user-roles.enum';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { SerializeIncludes } from './../utility/common/interceptors/serialize.interceptor';
import { ProductsDto } from './dto/products.dto';
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @ApiResponse({
    status: 201,
    description:
      'The product has been successfully created.',
    type: ProductEntity,
  })
  async create(
    @Body()
    createProductDto: CreateProductDto,
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.create(
      createProductDto,
      currentUser,
    );
  }
  @SerializeIncludes(ProductsDto)
  @Get('all')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description:
      'Returns a list of all products.',
    type: ProductsDto,
  })
  async findAll(
    @Query()
    query: any,
  ): Promise<ProductsDto> {
    return await this.productsService.findAll(
      query,
    );
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get a single product by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the product details.',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async findOne(
    @Param('id')
    id: string,
  ): Promise<ProductEntity> {
    return await this.productsService.findOne(
      +id,
    );
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product by ID',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product has been successfully updated.',
    type: ProductEntity,
  })
  async update(
    @Param('id')
    id: string,
    @Body()
    updateProductDto: UpdateProductDto,
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    return await this.productsService.update(
      +id,
      updateProductDto,
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
    summary:
      'Delete a product by ID (Admin Only)',
  })
  @ApiResponse({
    status: 200,
    description:
      'The product has been successfully deleted.',
    type: ProductEntity,
  })
  async remove(
    @Param('id')
    id: string,
  ) {
    return await this.productsService.remove(+id);
  }
}
