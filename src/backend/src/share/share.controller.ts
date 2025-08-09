// src/share/share.controller.ts
import { ActivityLogsService } from '../activity-logs/activity-logs.service'
//import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { ShareService } from './share.service';

@Controller('share')
export class ShareController {
  // constructor(private readonly shareService: ShareService) { }

  // Endpoint này là PUBLIC, không có @UseGuards
  // @Get(':token')
  // getSharedMemory(@Param('token') token: string) {
  //   return this.shareService.getSharedMemory(token);
  // }
  constructor(
    private readonly shareService: ShareService,
    private readonly activityLogsService: ActivityLogsService,
  ) { }

  @Get(':token')
  async getSharedMemory(@Param('token') token: string, @Req() req: any) {
    const sharedMemory = await this.shareService.getSharedMemory(token, req.user); // ✅ truyền currentUser vào đây

    if (req.user) {
      await this.activityLogsService.logActivity(
        req.user.userID, // ✅ nhớ truyền userID chứ không truyền nguyên object
        'Viewed shared memory',
        sharedMemory?.memory?.title || 'Unknown'
      );
    }

    return sharedMemory;
  }

}