import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) { }

  async getAllLogs() {
    return this.prisma.activityLog.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async logActivity(
    userID: string, // chỉ cần ID
    action: string,
    target: string,
  ) {
    // Lấy thông tin user từ bảng User
    const user = await this.prisma.user.findUnique({
      where: { userID },
      select: {
        display_name: true,
        email: true,
        avatar: true,
      },
    });

    // Nếu không tìm thấy user → không log
    if (!user) return;

    // Lưu log
    return this.prisma.activityLog.create({
      data: {
        name: user.display_name,
        email: user.email,
        avatar: user.avatar ?? '',
        action,
        target,
      },
    });
  }
}
