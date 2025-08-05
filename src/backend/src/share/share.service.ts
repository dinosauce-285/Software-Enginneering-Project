// src/share/share.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShareService {
  constructor(private prisma: PrismaService) {}

  async getSharedMemory(shareToken: string) {
    const shareLink = await this.prisma.shareLink.findUnique({
      where: { url: shareToken },
      include: {
        memory: {
          include: {
            user: { select: { display_name: true, avatar: true } },
            emotion: true,
            media: true,
            memoryTags: { include: { tag: true } },
          },
        },
      },
    });

    if (!shareLink || (shareLink.expiration_date && new Date() > shareLink.expiration_date)) {
      throw new NotFoundException('This share link is invalid or has expired.');
    }
    
    // Chỉ trả về những thông tin cần thiết, không trả về thông tin nhạy cảm của user
    const { user, ...memoryDetails } = shareLink.memory;
    
    return {
      memory: memoryDetails,
      author: user
    };
  }
}