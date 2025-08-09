// src/reminders/reminders.service.ts
import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  /**
   * Tác vụ tự động chạy mỗi giờ để tạo lời nhắc AI.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyAIReminders() {
    const currentHourUTC = new Date().getUTCHours();
    this.logger.log(`Running reminder job for hour: ${currentHourUTC} UTC`);

    const usersToRemind = await this.prisma.user.findMany({
      where: {
        emailNotificationsEnabled: true,
        reminderTime: currentHourUTC,
      },
      select: { userID: true }
    });

    if (usersToRemind.length === 0) return;
    this.logger.log(`Found ${usersToRemind.length} users to remind.`);

    for (const user of usersToRemind) {
      try {
        const content = await this.createAIReminderContent();
        // TẠO BẢN GHI TRONG BẢNG REMINDER
        await this.prisma.reminder.create({
          data: {
            userID: user.userID,
            content: content,
          },
        });
      } catch (error) {
        this.logger.error(`Failed to process reminder for user ${user.userID}`, error.stack);
      }
    }
  }

  // Hàm tạo nội dung AI
  private async createAIReminderContent(): Promise<string> {
    const prompt = "Write one short, creative, and thought-provoking prompt to encourage a user to write in their journal today. The prompt should be in English and feel like a gentle nudge.";
    if (this.model) {
      try {
        const result = await this.model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error) {
        console.error("Lỗi khi gọi Gemini API:", error);
      }
    }
    return "What's on your mind today? Let's write it down.";
  }

  // --- API LOGIC CHO FRONTEND ---
  
  /**
   * Lấy tất cả lời nhắc cho một người dùng.
   */
  async getRemindersForUser(userId: string) {
    return this.prisma.reminder.findMany({
      where: { userID: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  /**
   * Đánh dấu một lời nhắc là đã đọc.
   */
  async markAsRead(userId: string, reminderId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { reminderID: reminderId, userID: userId }
    });
    if (!reminder) {
      throw new ForbiddenException("Reminder not found or access denied.");
    }
    return this.prisma.reminder.update({
      where: { reminderID: reminderId },
      data: { isRead: true },
    });
  }

  async test_createSingleAIReminder(userId: string) {
        this.logger.log(`Manually generating AI reminder for user ${userId}...`);
        try {
            const content = await this.createAIReminderContent();
            return this.prisma.reminder.create({
                data: {
                    userID: userId,
                    content: content,
                },
            });
        } catch (error) {
            this.logger.error(`Failed to manually generate reminder for user ${userId}`, error.stack);
            throw error;
        }
    }
}