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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

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


  @Post(':id/media')
  // Thay đổi ở đây: Dùng FilesInterceptor để nhận một mảng file có tên là 'files'
  @UseInterceptors(FilesInterceptor('files', 10)) // Cho phép tối đa 10 file
  addMedia(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    // Thay đổi ở đây: Dùng @UploadedFiles và kiểu dữ liệu là một mảng
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10 MB cho mỗi file
          new FileTypeValidator({ 
            // Regex mới hỗ trợ nhiều định dạng phổ biến hơn
            fileType: '.(png|jpeg|jpg|gif|webp|mp3|mpeg|wav|ogg|mp4|webm|mov|pdf|docx)',
          }),
        ],
      }),
    ) files: Array<Express.Multer.File>, // <-- Kiểu dữ liệu là một mảng
  ) {
    // Gọi đến service, truyền vào cả mảng files
    return this.memoriesService.addMediaToMemory(userId, memoryId, files);
  }

  @Delete('media/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMedia(
    @GetUser('userID') userId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    return this.memoriesService.deleteMedia(userId, mediaId);
  }
}