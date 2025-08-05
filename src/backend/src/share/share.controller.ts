// src/share/share.controller.ts
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ShareService } from './share.service';

@Controller('share')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  // Endpoint này là PUBLIC, không có @UseGuards
  @Get(':token')
  getSharedMemory(@Param('token') token: string) {
    return this.shareService.getSharedMemory(token);
  }
}