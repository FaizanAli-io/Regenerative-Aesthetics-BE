import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from './../utility/common/decorators/current-user.decorator';
import { AuthenticationGuard } from './../utility/common/guards/authentication.guard';
import { Roles } from './../utility/common/user-roles.enum';
import { AuthorizeGuard } from './../utility/common/guards/authorization.guard';
import { AddContactDetailsDto } from './dto/add-contact-details.dto';
import { AddressBookEntity } from './entities/address-book.entity';
import { UpdateContactDetailsDto } from './dto/update-contact-details.dto';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
  @Post('signup')
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({
    status: 201,
    description:
      'The user has been successfully signed up.',
    type: UserEntity,
  })
  async signup(
    @Body()
    userSignUpDto: UserSignUpDto,
  ): Promise<{
    user: UserEntity;
  }> {
    return {
      user: await this.usersService.signup(
        userSignUpDto,
      ),
    };
  }
  @Post('signin')
  @ApiOperation({ summary: 'User Sign In' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in.',
    type: UserEntity,
  })
  async signin(
    @Body()
    userSignInDto: UserSignInDto,
  ): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.signin(
      userSignInDto,
    );
    const accessToken =
      await this.usersService.accessToken(user);
    return { accessToken, user };
  }
  // IMP: email service is not yet complete so this is commented:
  @Get('verify-email')
  @ApiOperation({ summary: 'Verify User Email' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully.',
  })
  async verifyEmail(
    @Query('token')
    token: string,
  ) {
    await this.usersService.verifyEmailToken(
      token,
    );
    return {
      message: 'Email verified successfully',
    };
  }
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset link',
  })
  @ApiResponse({
    status: 200,
    description:
      'Reset link sent to email if user exists.',
  })
  async forgotPassword(
    @Body('email')
    email: string,
  ) {
    await this.usersService.requestPasswordReset(
      email,
    );
    return {
      message:
        'If your email is registered, you will receive a password reset link shortly.',
    };
  }
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password with token',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful.',
  })
  async resetPassword(
    @Body('token')
    token: string,
    @Body('newPassword')
    newPassword: string,
  ) {
    await this.usersService.resetPassword(
      token,
      newPassword,
    );
    return {
      message:
        'Password has been reset successfully.',
    };
  }
  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([Roles.ADMIN]),
  )
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users (Admin Only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all users.',
    type: [UserEntity],
  })
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }
  @Get('single/:id')
  @ApiOperation({
    summary: 'Get a single user by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a user by ID.',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async findOne(
    @Param('id')
    id: string,
  ) {
    const user =
      await this.usersService.findOne(+id);
    if (!user)
      throw new NotFoundException(
        'User not found.',
      );
    return user;
  }
  @UseGuards(AuthenticationGuard)
  @Patch('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user details',
  })
  @ApiResponse({
    status: 200,
    description:
      'The user details have been successfully updated.',
    type: UserEntity,
  })
  async update(
    @Body()
    updateUserDto: UpdateUserDto,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.usersService.update(
      currentUser.id,
      updateUserDto,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current logged-in user profile',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the current logged-in user.',
    type: UserEntity,
  })
  getProfile(
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return currentUser;
  }
  @UseGuards(AuthenticationGuard)
  @Post('contact')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add contact details for a user.',
  })
  async addContactDetails(
    @CurrentUser()
    currentUser: UserEntity,
    @Body()
    addContactDetailsDto: AddContactDetailsDto,
  ): Promise<AddressBookEntity> {
    return await this.usersService.addContactDetails(
      currentUser,
      addContactDetailsDto,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Get('contact')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all saved contact details of a user',
  })
  async getContactDetails(
    @CurrentUser()
    currentUser: UserEntity,
  ): Promise<AddressBookEntity[]> {
    return await this.usersService.getContactDetails(
      currentUser,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Patch('contact/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Update contact details of a user by instance id.',
  })
  async updateContactDetails(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser()
    currentUser: UserEntity,
    @Body()
    updateContactDetailsDto: UpdateContactDetailsDto,
  ) {
    return await this.usersService.updateContactDetails(
      id,
      currentUser,
      updateContactDetailsDto,
    );
  }
  @UseGuards(AuthenticationGuard)
  @Delete('contact/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Delete contact details by instance id.',
  })
  async deleteContactDetails(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser()
    currentUser: UserEntity,
  ) {
    return await this.usersService.deleteContactDetails(
      id,
      currentUser,
    );
  }
}
