// src/share/share.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class ShareService {
//   constructor(private prisma: PrismaService) {}

//   async getSharedMemory(shareToken: string) {
//     const shareLink = await this.prisma.shareLink.findUnique({
//       where: { url: shareToken },
//       include: {
//         memory: {
//           include: {
//             user: { select: { display_name: true, avatar: true } },
//             emotion: true,
//             media: true,
//             memoryTags: { include: { tag: true } },
//           },
//         },
//       },
//     });

//     if (!shareLink || (shareLink.expiration_date && new Date() > shareLink.expiration_date)) {
//       throw new NotFoundException('This share link is invalid or has expired.');
//     }
    
//     // Chỉ trả về những thông tin cần thiết, không trả về thông tin nhạy cảm của user
//     const { user, ...memoryDetails } = shareLink.memory;
    
//     return {
//       memory: memoryDetails,
//       author: user
//     };
//   }
// }

// src/share/share.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class ShareService {
  constructor(
    private prisma: PrismaService,
    private activityLogsService: ActivityLogsService
  ) {}

  async getSharedMemory(shareToken: string) { // <<< Xóa tham số currentUser đi
    const shareLink = await this.prisma.shareLink.findUnique({
      where: { url: shareToken },
      include: {
        memory: {
          include: {
            user: { select: { userID: true, display_name: true, avatar: true } }, // Lấy cả userID để ghi log
            emotion: true,
            media: true,
            memoryTags: { include: { tag: true } },
          },
        },
      },
    });

    if (
      !shareLink ||
      (shareLink.expiration_date && new Date() > shareLink.expiration_date)
    ) {
      throw new NotFoundException(
        'This share link is invalid or has expired.'
      );
    }

    // Phần ghi log đã được chuyển sang controller
    // vì service không nên biết về `req.user`

    const { user, ...memoryDetails } = shareLink.memory;

    return {
      memory: memoryDetails,
      author: user,
    };
  }
}
