import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateUser(userId: number, dto: UserDTO) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }
}
