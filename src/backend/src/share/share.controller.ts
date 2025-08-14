// src/share/share.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ShareService } from './share.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator'; // Import decorator GetUser
import { User } from '@prisma/client';
import { JwtOptionalGuard } from '../auth/guard/jwt-optional.guard';
// Dùng AuthGuard nhưng đặt nó ở chế độ tùy chọn (optional)
// Nó sẽ gắn req.user nếu có token hợp lệ, nhưng không báo lỗi nếu không có.
@UseGuards(JwtOptionalGuard)
@Controller('share')
export class ShareController {
  constructor(
    private readonly shareService: ShareService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  @Get(':token')
  async getSharedMemory(
    @Param('token') token: string,
    @GetUser() currentUser: User | undefined // Dùng GetUser để lấy user, có thể là undefined
  ) {
    const sharedMemory = await this.shareService.getSharedMemory(token);

    // Chỉ ghi log nếu người xem là một người dùng đã đăng nhập
    if (currentUser) {
      await this.activityLogsService.logActivity(
        currentUser.userID,
        'Viewed shared memory',
        sharedMemory?.memory?.title || 'Unknown'
      );
    }

    return sharedMemory;
  }
}