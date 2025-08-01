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
  Query, // Thêm Query
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SearchMemoryDto } from './dto/search-memory.dto'; // Thêm DTO mới

@UseGuards(AuthGuard('jwt'))
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

  // Phương thức search mới được thêm vào đây
  // Vị trí này rất quan trọng: nó phải được đặt TRƯỚC route động ':id'
  @Get('search')
  searchMemories(
    @GetUser('userID') userId: string,
    @Query() dto: SearchMemoryDto,
  ) {
    return this.memoriesService.search(userId, dto);
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

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  createOrGetShareLink(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
  ) {
    return this.memoriesService.createOrGetShareLink(userId, memoryId);
  }

  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files', 10))
  addMedia(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }),
          new FileTypeValidator({
            fileType:
              '.(png|jpeg|jpg|gif|webp|mp3|mpeg|wav|ogg|mp4|webm|mov|pdf|docx)',
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
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