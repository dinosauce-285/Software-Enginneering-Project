// src/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ReportsService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      console.warn("GEMINI_API_KEY is not set. AI summary will be disabled.");
    }
  }

  async getEmotionReport(userId: string, startDate: Date, endDate: Date) {
      // BƯỚỚC 1: Thống kê (giữ nguyên)
      const emotionStats = await this.prisma.memory.groupBy({
        by: ['emotionID'],
        where: { userID: userId, created_at: { gte: startDate, lte: endDate } },
        _count: { emotionID: true },
      });

      if (emotionStats.length === 0) {
          return {
              emotionBreakdown: [],
              totalMemories: 0,
              summary: "You have no memories in this period. Let's start journaling!",
          };
      }
      
      const emotionIds = emotionStats.map(stat => stat.emotionID);
      const emotions = await this.prisma.emotion.findMany({ where: { emotionID: { in: emotionIds } } });
      const emotionsMap = new Map(emotions.map(e => [e.emotionID, { name: e.name, symbol: e.symbol }]));
      const totalMemories = emotionStats.reduce((sum, stat) => sum + stat._count.emotionID, 0);
      const emotionBreakdown = emotionStats
          .map(stat => ({
              emotionID: stat.emotionID,
              ...emotionsMap.get(stat.emotionID),
              count: stat._count.emotionID,
              percentage: parseFloat(((stat._count.emotionID / totalMemories) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.count - a.count);

      // <<< BƯỚC 2 & 3: LẤY THÊM NGỮ CẢNH >>>
      let sampleMemories: { title: string }[] = [];
      if (emotionBreakdown.length > 0) {
          // Lấy ID của cảm xúc chiếm ưu thế nhất
          const dominantEmotionId = emotionBreakdown[0].emotionID;
          // Lấy tối đa 3 tiêu đề ký ức của cảm xúc đó
          sampleMemories = await this.prisma.memory.findMany({
              where: {
                  userID: userId,
                  emotionID: dominantEmotionId,
                  created_at: { gte: startDate, lte: endDate },
              },
              take: 3,
              orderBy: { created_at: 'desc' },
              select: { title: true },
          });
      }

      // <<< BƯỚC 4: TẠO PROMPT "GIÀU NGỮ CẢNH" HƠN >>>
      let summary: string;
      if (this.model) {
          const prompt = this.createRichPromptForAI(emotionBreakdown, totalMemories, sampleMemories);
          summary = await this.generateAISummary(prompt);
      } else {
          summary = `During this period, you've recorded ${totalMemories} memories. Let's see the details!`;
      }
      return { emotionBreakdown, totalMemories, summary };
  }

  // --- PROMPT ĐÃ ĐƯỢỢC NÂNG CẤP ---
  private createRichPromptForAI(breakdown: any[], total: number, samples: {title: string}[]): string {
    const dataString = breakdown
      .map(e => `${e.name}: ${e.percentage}%`)
      .join(', ');
    
    // Thêm các ví dụ về tiêu đề ký ức vào prompt
    const sampleTitles = samples.map(s => `- "${s.title}"`).join('\n');

    return `
      You are a sympathetic, insightful, and positive mental health assistant.
      Based on the user's emotional statistics AND specific memory examples from the past period, write a warm and encouraging summary (about 2-3 sentences) in English.
      You should subtly reference one of the memory titles to make the advice feel more personal and relevant.
      Use a friendly, non-judgmental tone. Do not mention the name "SoulNote".

      Statistical Data:
      - Total memories: ${total}
      - Emotion Breakdown: ${dataString}

      Examples of their most dominant emotion's memories:
      ${sampleTitles}

      Your personal and slightly longer summary:
    `;
  }

  // Hàm generateAISummary không cần thay đổi
  private async generateAISummary(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text.trim();
    } catch (error) {
      console.error("Error calling Google Gemini API:", error);
      return "There seems to be a slight interruption while analyzing your emotions.";
    }
  }
}