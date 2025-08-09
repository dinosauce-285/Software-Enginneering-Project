import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) { }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'ADMIN' | 'USER';
  }) {
    const { page = 1, limit = 8, search, role } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { display_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          userID: true,
          display_name: true,
          email: true,
          avatar: true,
          role: true,
          created_at: true,
        },
        skip,
        take: Number(limit),
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.update({
      where: { userID: userId },
      data: { ...dto },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const uploadResult = await this.cloudinary.uploadFile(file, 'avatars');

    const updatedUser = await this.prisma.user.update({
      where: { userID: userId },
      data: { avatar: uploadResult.secure_url },
    });

    const { passwordHash, ...result } = updatedUser;
    return result;
  }


  async updateSettings(userId: string, dto: UpdateUserSettingsDto) {
    return this.prisma.user.update({
      where: { userID: userId },
      data: { ...dto },

      select: { emailNotificationsEnabled: true, reminderTime: true },
    });
  }
  async updateUserRole(userId: string, dto: UpdateUserRoleDto) {
    return this.prisma.user.update({
      where: { userID: userId },
      data: { role: dto.role },
      select: { userID: true, role: true },
    });
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { userID: userId },
    });
    return { message: 'User deleted successfully.' };
  }
}