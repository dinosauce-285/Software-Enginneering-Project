// src/reminders/reminders.controller.ts
import { Controller, Get, UseGuards, Patch, Param, ParseUUIDPipe,Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { RemindersService } from './reminders.service';

@UseGuards(AuthGuard('jwt'))
@Controller('reminders')
export class RemindersController {
  constructor(private remindersService: RemindersService) {}

  /**
   * GET /reminders
   * Lấy danh sách các lời nhắc đã được tạo cho người dùng.
   */
  @Get()
  getReminders(@GetUser('userID') userId: string) {
    return this.remindersService.getRemindersForUser(userId);
  }
  
  /**
   * PATCH /reminders/:id/read
   * Đánh dấu một lời nhắc là đã đọc.
   */
  @Patch(':id/read')
  markAsRead(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) reminderId: string
  ) {
    return this.remindersService.markAsRead(userId, reminderId);
  }

  @Post('test-generation')
testGeneration(@GetUser('userID') userId: string) {
// Chúng ta sẽ sửa lại hàm service một chút để nó có thể nhận userId
// và chỉ tạo reminder cho user đang test.
return this.remindersService.test_createSingleAIReminder(userId);
}

}