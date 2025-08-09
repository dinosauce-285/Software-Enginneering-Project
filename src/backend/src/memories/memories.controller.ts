// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   ParseUUIDPipe,
//   HttpCode,
//   HttpStatus,
//   UseInterceptors,
//   UploadedFiles,
//   ParseFilePipe,
//   MaxFileSizeValidator,
//   FileTypeValidator,
//   Query,
// } from '@nestjs/common';
// import { MemoriesService } from './memories.service';
// import { CreateMemoryDto } from './dto/create-memory.dto';
// import { UpdateMemoryDto } from './dto/update-memory.dto';
// import { AuthGuard } from '@nestjs/passport';
// import { GetUser } from '../auth/decorator/get-user.decorator';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { SearchMemoryDto } from './dto/search-memory.dto'; // Import DTO
// import { CreateShareLinkDto } from './dto/create-sharelink.dto';
// import { ActivityLogsService } from '../activity-logs/activity-logs.service';

// @UseGuards(AuthGuard('jwt'))
// @Controller('memories')
// export class MemoriesController {
//   //constructor(private readonly memoriesService: MemoriesService) {}
//   constructor(
//     private readonly memoriesService: MemoriesService,
//     private readonly activityLogsService: ActivityLogsService, // 👈 THÊM DÒNG NÀY
//   ) { }
//   @Post()
//   createMemory(@GetUser('userID') userId: string, @Body() dto: CreateMemoryDto) {
//     return this.memoriesService.createMemory(userId, dto);
//   }

//   @Get()
//   getMemories(@GetUser('userID') userId: string) {
//     return this.memoriesService.getMemories(userId);
//   }

//   @Get('search')
//   searchMemories(
//     @GetUser('userID') userId: string,
//     // === KHÔI PHỤC LẠI TRẠNG THÁI CHUẨN ===
//     @Query() dto: SearchMemoryDto,
//   ) {
//     console.log('[BACKEND-CONTROLLER] Received DTO:', dto);
//     return this.memoriesService.search(userId, dto);
//   }

//   @Get(':id')
//   getMemoryById(
//     @GetUser('userID') userId: string,
//     @Param('id', ParseUUIDPipe) memoryId: string,
//   ) {
//     return this.memoriesService.getMemoryById(userId, memoryId);
//   }

//   @Patch(':id')
//   updateMemoryById(
//     @GetUser('userID') userId: string,
//     @Param('id', ParseUUIDPipe) memoryId: string,
//     @Body() dto: UpdateMemoryDto,
//   ) {
//     return this.memoriesService.updateMemoryById(userId, memoryId, dto);
//   }

//   //  @HttpCode(HttpStatus.NO_CONTENT)
//   //  @Delete(':id')
//   // deleteMemoryById(
//   //   @GetUser('userID') userId: string,
//   //   @Param('id', ParseUUIDPipe) memoryId: string,
//   // ) {
//   //   return this.memoriesService.deleteMemoryById(userId, memoryId);
//   // }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async deleteMemoryById(
//     @GetUser('userID') userId: string,
//     @Param('id', ParseUUIDPipe) memoryId: string,
//   ) {
//     // Gọi service xóa
//     const memory = await this.memoriesService.deleteMemoryById(userId, memoryId);

//     // Ghi activity log
//     await this.activityLogsService.logActivity(
//       userId,
//       'Deleted memory',
//       memory.title, // hoặc memoryId nếu bạn không có title
//     );

//     return;
//   }


//   @Post(':id/share')
//   @HttpCode(HttpStatus.OK)
//   createOrGetShareLink(
//     @GetUser('userID') userId: string,
//     @Param('id', ParseUUIDPipe) memoryId: string,
//     @Body() dto: CreateShareLinkDto,
//   ) {
//     return this.memoriesService.createOrGetShareLink(userId, memoryId, dto);
//   }

//   @Post(':id/media')
//   @UseInterceptors(FilesInterceptor('files', 10))
//   addMedia(
//     @GetUser('userID') userId: string,
//     @Param('id', ParseUUIDPipe) memoryId: string,
//     @UploadedFiles(
//       new ParseFilePipe({
//         validators: [
//           new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }),
//           new FileTypeValidator({
//             fileType:
//               '.(png|jpeg|jpg|gif|webp|mp3|mpeg|wav|ogg|mp4|webm|mov|mov|)',
//           }),
//         ],
//       }),
//     )
//     files: Array<Express.Multer.File>,
//   ) {
//     return this.memoriesService.addMediaToMemory(userId, memoryId, files);
//   }

//   @Delete('media/:mediaId')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   deleteMedia(
//     @GetUser('userID') userId: string,
//     @Param('mediaId', ParseUUIDPipe) mediaId: string,
//   ) {
//     return this.memoriesService.deleteMedia(userId, mediaId);
//   }
// }


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
  Query,
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SearchMemoryDto } from './dto/search-memory.dto';
import { CreateShareLinkDto } from './dto/create-sharelink.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@UseGuards(AuthGuard('jwt'))
@Controller('memories')
export class MemoriesController {
  constructor(
    private readonly memoriesService: MemoriesService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  @Post()
  async createMemory(
    @GetUser('userID') userId: string,
    @Body() dto: CreateMemoryDto,
  ) {
    const memory = await this.memoriesService.createMemory(userId, dto);

    await this.activityLogsService.logActivity(
      userId,
      'Created memory',
      memory.title,
    );

    return memory;
  }

  @Get()
  getMemories(@GetUser('userID') userId: string) {
    return this.memoriesService.getMemories(userId);
  }

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
  async updateMemoryById(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    @Body() dto: UpdateMemoryDto,
  ) {
    const memory = await this.memoriesService.updateMemoryById(userId, memoryId, dto);

    await this.activityLogsService.logActivity(
      userId,
      'Updated memory',
      memory.title,
    );

    return memory;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMemoryById(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
  ) {
    const memory = await this.memoriesService.deleteMemoryById(userId, memoryId);

    await this.activityLogsService.logActivity(
      userId,
      'Deleted memory',
      memory.title,
    );

    return;
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  async createOrGetShareLink(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    @Body() dto: CreateShareLinkDto,
  ) {
    const result = await this.memoriesService.createOrGetShareLink(userId, memoryId, dto);

    await this.activityLogsService.logActivity(
      userId,
      'Shared memory',
      result.title || memoryId,
    );

    return result;
  }

  @Post(':id/media')
  @UseInterceptors(FilesInterceptor('files', 10))
  async addMedia(
    @GetUser('userID') userId: string,
    @Param('id', ParseUUIDPipe) memoryId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 50 }),
          new FileTypeValidator({
            fileType:
              '.(png|jpeg|jpg|gif|webp|mp3|mpeg|wav|ogg|mp4|webm|mov|mov|)',
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const memory = await this.memoriesService.addMediaToMemory(userId, memoryId, files);

    await this.activityLogsService.logActivity(
      userId,
      'Added media to memory',
      memory.title || memoryId,
    );

    return memory;
  }

  @Delete('media/:mediaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMedia(
    @GetUser('userID') userId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    await this.memoriesService.deleteMedia(userId, mediaId);

    await this.activityLogsService.logActivity(
      userId,
      'Deleted media',
      mediaId,
    );
  }
}
