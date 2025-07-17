import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  // 1. Tạo một kỷ niệm mới
  async createMemory(userId: string, dto: CreateMemoryDto) {
    const memory = await this.prisma.memory.create({
      data: {
        userID: userId,
        ...dto,
      },
    });
    return memory;
  }

  // 2. Lấy tất cả kỷ niệm của một người dùng
  async getMemories(userId: string) {
    return this.prisma.memory.findMany({
      where: {
        userID: userId,
      },
      orderBy: {
        created_at: 'desc', // Sắp xếp theo ngày tạo mới nhất
      },
    });
  }

  // 3. Lấy một kỷ niệm cụ thể bằng ID
  async getMemoryById(userId: string, memoryId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: {
        memoryID: memoryId,
      },
    });

    // Nếu không tìm thấy hoặc kỷ niệm không thuộc về người dùng này -> Lỗi
    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return memory;
  }

  // 4. Cập nhật một kỷ niệm
  async updateMemoryById(userId: string, memoryId: string, dto: UpdateMemoryDto) {
    // Lấy kỷ niệm để kiểm tra quyền sở hữu
    const memory = await this.prisma.memory.findUnique({
      where: {
        memoryID: memoryId,
      },
    });

    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    // Cập nhật kỷ niệm
    return this.prisma.memory.update({
      where: {
        memoryID: memoryId,
      },
      data: {
        ...dto,
      },
    });
  }

  // 5. Xóa một kỷ niệm
  async deleteMemoryById(userId: string, memoryId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: {
        memoryID: memoryId,
      },
    });

    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.prisma.memory.delete({
      where: {
        memoryID: memoryId,
      },
    });

    // Trả về một object rỗng hoặc một message thành công
    return { message: 'Memory deleted successfully' };
  }
}