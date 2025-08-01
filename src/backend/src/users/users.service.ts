// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  /**
   * Cập nhật thông tin user theo ID.
   */
  async updateUser(userId: string, dto: UpdateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.update({
      where: { userID: userId },
      data: { ...dto },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  // --- HÀM MỚI DÀNH CHO ADMIN ---
  /**
   * Lấy danh sách tất cả người dùng.
   */
  async getUsers(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    // Loại bỏ passwordHash khỏi mỗi user trong danh sách
    return users.map(user => {
      const { passwordHash, ...result } = user;
      return result;
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Upload file lên Cloudinary, lưu vào thư mục 'avatars'
    const uploadResult = await this.cloudinary.uploadFile(file, 'avatars');

    // Cập nhật trường avatar của user trong DB với URL mới
    const updatedUser = await this.prisma.user.update({
      where: { userID: userId },
      data: { avatar: uploadResult.secure_url },
    });

    // Loại bỏ passwordHash trước khi trả về
    const { passwordHash, ...result } = updatedUser;
    return result;
  }

}