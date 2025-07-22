// src/emotions/emotions.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { EmotionsService } from './emotions.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Yêu cầu người dùng phải đăng nhập
@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Get()
  findAll() {
    return this.emotionsService.findAll();
  }
}