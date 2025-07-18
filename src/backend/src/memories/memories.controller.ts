// src/memories/memories.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';

@UseGuards(AuthGuard('jwt')) // Bảo vệ tất cả các route trong controller này
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  createMemory(@GetUser('userID') userId: string, @Body() dto: CreateMemoryDto) {
    return this.memoriesService.createMemory(userId, dto);
  }

  @Get()
  getMemories(@GetUser('userID') userId: string) {
    return this.memoriesService.getMemories(userId);
  }

  @Get(':id')
  getMemoryById(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
  ) {
    return this.memoriesService.getMemoryById(userId, memoryId);
  }

  @Patch(':id')
  updateMemoryById(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    @Body() dto: UpdateMemoryDto,
  ) {
    return this.memoriesService.updateMemoryById(userId, memoryId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteMemoryById(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
  ) {
    return this.memoriesService.deleteMemoryById(userId, memoryId);
  }

  // === PHẦN ĐƯỢC THAY ĐỔI ===
  // Endpoint để tạo hoặc lấy link chia sẻ
  @Post(':id/share')
  @HttpCode(HttpStatus.OK) // Trả về 200 OK vì có thể chỉ lấy link cũ
  createOrGetShareLink(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
  ) {
    // Không cần @Body() và DTO nữa
    return this.memoriesService.createOrGetShareLink(userId, memoryId);
  }
}