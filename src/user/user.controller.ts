import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UserDTO } from './user-dto';
import { UserService } from './user.service';
import { GetUser } from './user_decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(@Body() dto: UserDTO, @GetUser('id') userId: number) {
    return this.userService.updateUser(userId, dto);
  }
}
