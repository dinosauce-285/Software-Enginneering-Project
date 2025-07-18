import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Hàm cập nhật thông tin user
  // Chúng ta sẽ trả về object User nhưng bỏ đi passwordHash
  async updateUser(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.update({
      where: {
        userID: userId,
      },
      data: {
        ...dto,
      },
    });

    // Loại bỏ passwordHash trước khi trả về cho client
    const { passwordHash, ...result } = user;
    return result;
  }
}