// src/emotions/emotions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmotionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Lấy tất cả các cảm xúc từ cơ sở dữ liệu.
   */
  findAll() {
    return this.prisma.emotion.findMany({
      orderBy: {
        name: 'asc', // Sắp xếp theo tên cho dễ nhìn
      },
    });
  }
}