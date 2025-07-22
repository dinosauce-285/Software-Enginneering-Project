// src/emotions/emotions.module.ts
import { Module } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { EmotionsController } from './emotions.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <-- Import

@Module({
  imports: [PrismaModule], // <-- Thêm vào đây
  controllers: [EmotionsController],
  providers: [EmotionsService],
})
export class EmotionsModule {}