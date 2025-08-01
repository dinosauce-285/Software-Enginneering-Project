// import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateMemoryDto } from './dto/create-memory.dto';
// import { UpdateMemoryDto } from './dto/update-memory.dto';
// import { AccessLevel, Prisma, MediaType } from '@prisma/client';
// import { CloudinaryService } from '../cloudinary/cloudinary.service';
// import { SearchMemoryDto } from './dto/search-memory.dto';

// @Injectable()
// export class MemoriesService {
//   constructor(
//     private prisma: PrismaService,
//     private cloudinary: CloudinaryService,
//   ) {}

//   async search(userId: string, searchDto: SearchMemoryDto) {
//     const { query, emotions, startDate, endDate } = searchDto;

//     const where: Prisma.MemoryWhereInput = {
//       userID: userId,
//     };

//     if (emotions && emotions.length > 0) {
   
//       where.emotionID = { 
//         in: emotions,
//       };
//     }
    
//     if (startDate) {
//       if (!where.created_at) {
//         where.created_at = {};
//       }
//       (where.created_at as Prisma.DateTimeFilter).gte = new Date(startDate);
//     }
    
//     if (endDate) {
//       if (!where.created_at) {
//         where.created_at = {};
//       }
//       (where.created_at as Prisma.DateTimeFilter).lte = new Date(endDate);
//     }
    
//     if (query) {
//       where.OR = [
//         {
//           title: {
//             contains: query,
//             mode: 'insensitive',
//           },
//         },
//         {
//           content: {
//             contains: query,
//             mode: 'insensitive',
//           },
//         },
//         {
//           memoryTags: {
//             some: {
//               tag: {
//                 name: {
//                   contains: query,
//                   mode: 'insensitive',
//                 },
//               },
//             },
//           },
//         },
//       ];
//     }
    

//     console.log('Prisma WHERE clause:', JSON.stringify(where, null, 2));
    
//     return this.prisma.memory.findMany({
//       where,
//       orderBy: {
//         created_at: 'desc',
//       },
//       include: {
//         emotion: true,
//         media: true,
//         memoryTags: {
//           select: {
//             tag: {
//               select: {
//                 name: true,
//                 tagID: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   }

//   private async manageTags(tagNames: string[] | undefined) {
//     if (!tagNames || tagNames.length === 0) {
//       return [];
//     }
//     const tags = await this.prisma.$transaction(
//       tagNames.map((name) => {
//         const tagName = name.toLowerCase().trim();
//         return this.prisma.tag.upsert({
//           where: { name: tagName },
//           update: {},
//           create: { name: tagName },
//         });
//       }),
//     );
//     return tags.map((tag) => ({
//       tag: {
//         connect: {
//           tagID: tag.tagID,
//         },
//       },
//     }));
//   }

//   async createMemory(userId: string, dto: CreateMemoryDto) {
//     const { tags: tagNames, ...memoryData } = dto;
//     const tagConnections = await this.manageTags(tagNames);
//     const finalData: Prisma.MemoryCreateInput = {
//       user: { connect: { userID: userId } },
//       emotion: { connect: { emotionID: memoryData.emotionID } },
//       title: memoryData.title,
//       content: memoryData.content,
//       location: memoryData.location,
//       memoryTags: {
//         create: tagConnections,
//       },
//     };

//     if (memoryData.created_at) {
//       finalData.created_at = new Date(memoryData.created_at);
//     }

//     const memory = await this.prisma.memory.create({
//       data: finalData,
//       include: {
//         emotion: true,
//         memoryTags: {
//           include: {
//             tag: true,
//           },
//         },
//       },
//     });
//     return memory;
//   }

//   async getMemories(userId: string) {
//     return this.prisma.memory.findMany({
//       where: { userID: userId },
//       orderBy: { created_at: 'desc' },
//       include: {
//         emotion: true,
//         media: true,
//         memoryTags: {
//           select: {
//             tag: {
//               select: {
//                 name: true,
//                 tagID: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   }

//   async getMemoryById(userId: string, memoryId: string) {
//     const memory = await this.prisma.memory.findUnique({
//       where: { memoryID: memoryId },
//       include: {
//         emotion: true,
//         media: true,
//         memoryTags: {
//           include: {
//             tag: true,
//           },
//         },
//       },
//     });
//     if (!memory || memory.userID !== userId) {
//       throw new ForbiddenException('Access to resource denied');
//     }
//     return memory;
//   }

//   async updateMemoryById(
//     userId: string,
//     memoryId: string,
//     dto: UpdateMemoryDto,
//   ) {
//     await this.getMemoryById(userId, memoryId);
//     const { tags: tagNames, ...memoryData } = dto;
//     const tagConnections = await this.manageTags(tagNames);
//     return this.prisma.memory.update({
//       where: { memoryID: memoryId },
//       data: {
//         ...memoryData,
//         memoryTags: {
//           deleteMany: {},
//           create: tagConnections,
//         },
//       },
//       include: {
//         emotion: true,
//         memoryTags: {
//           include: {
//             tag: true,
//           },
//         },
//       },
//     });
//   }

//   async deleteMemoryById(userId: string, memoryId: string) {
//     await this.getMemoryById(userId, memoryId);
//     await this.prisma.memory.delete({
//       where: { memoryID: memoryId },
//     });
//     return { message: 'Memory deleted successfully' };
//   }

//   async createOrGetShareLink(userId: string, memoryId: string) {
//     await this.getMemoryById(userId, memoryId);
//     const existingLink = await this.prisma.shareLink.findFirst({
//       where: {
//         memoryID: memoryId,
//         access_level: AccessLevel.PUBLIC,
//       },
//     });
//     if (existingLink) {
//       return existingLink;
//     }
//     const newShareLink = await this.prisma.shareLink.create({
//       data: {
//         memoryID: memoryId,
//         access_level: AccessLevel.PUBLIC,
//         expiration_date: null,
//         url: '',
//       },
//     });
//     const finalLink = await this.prisma.shareLink.update({
//       where: { shareID: newShareLink.shareID },
//       data: {
//         url: newShareLink.shareID,
//       },
//     });
//     return finalLink;
//   }

//   async addMediaToMemory(
//     userId: string,
//     memoryId: string,
//     files: Array<Express.Multer.File>,
//   ) {
//     await this.getMemoryById(userId, memoryId);
//     if (!files || files.length === 0) {
//       throw new BadRequestException('At least one file is required.');
//     }
//     const uploadPromises = files.map((file) =>
//       this.cloudinary.uploadFile(file, `soulnote-memories/${userId}`),
//     );
//     const uploadResults = await Promise.all(uploadPromises);
//     const mediaDataToCreate = uploadResults.reduce((acc, result, index) => {
//       const file = files[index];
//       const mediaType = file.mimetype.startsWith('image/')
//         ? MediaType.IMAGE
//         : file.mimetype.startsWith('audio/')
//         ? MediaType.AUDIO
//         : file.mimetype.startsWith('video/')
//         ? MediaType.VIDEO
//         : file.mimetype.includes('pdf') || file.mimetype.includes('document')
//         ? MediaType.DOCUMENT
//         : null;
//       if (mediaType) {
//         acc.push({
//           memoryID: memoryId,
//           url: result.secure_url,
//           publicId: result.public_id,
//           type: mediaType,
//         });
//       }
//       return acc;
//     }, [] as Prisma.MediaCreateManyInput[]);
//     if (mediaDataToCreate.length === 0) {
//       throw new BadRequestException(
//         'None of the uploaded files were of a supported type.',
//       );
//     }
//     await this.prisma.media.createMany({
//       data: mediaDataToCreate,
//     });
//     return {
//       message: `${mediaDataToCreate.length} file(s) uploaded successfully.`,
//     };
//   }

//   async deleteMedia(userId: string, mediaId: string) {
//     const media = await this.prisma.media.findUnique({
//       where: { mediaID: mediaId },
//       include: { memory: true },
//     });
//     if (!media || media.memory.userID !== userId) {
//       throw new ForbiddenException('Access to resource denied.');
//     }
//     await this.cloudinary.deleteFile(media.publicId);
//     await this.prisma.media.delete({
//       where: { mediaID: mediaId },
//     });
//     return { message: 'Media deleted successfully.' };
//   }
// }


import { BadRequestException, ForbiddenException, Injectable, NotFoundException, GoneException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AccessLevel, Prisma, MediaType } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SearchMemoryDto } from './dto/search-memory.dto';

@Injectable()
export class MemoriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  /**
   * 1. Tìm kiếm Ký ức. Đã cập nhật để tìm kiếm theo `memoryDate`.
   */
  async search(userId: string, searchDto: SearchMemoryDto) {
    const { query, emotions, startDate, endDate } = searchDto;

    const where: Prisma.MemoryWhereInput = {
      userID: userId,
    };

    if (emotions && emotions.length > 0) {
      where.emotionID = { in: emotions };
    }
    
    // --- SỬA LOGIC LỌC NGÀY THÁNG ---
    // Thay thế 'created_at' bằng 'memoryDate'
    if (startDate || endDate) {
      where.memoryDate = {};
      if (startDate) {
        (where.memoryDate as Prisma.DateTimeFilter).gte = new Date(startDate);
      }
      if (endDate) {
        (where.memoryDate as Prisma.DateTimeFilter).lte = new Date(endDate);
      }
    }
    
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { memoryTags: { some: { tag: { name: { contains: query, mode: 'insensitive' } } } } },
      ];
    }
    
    return this.prisma.memory.findMany({
      where,
      orderBy: {
        memoryDate: 'desc', // Sắp xếp theo ngày của ký ức
      },
      include: {
        emotion: true,
        media: true,
        memoryTags: {
          select: {
            tag: { select: { name: true, tagID: true } },
          },
        },
      },
    });
  }

  /**
   * [HELPER] Xử lý tags.
   */
  private async manageTags(tagNames: string[] | undefined) {
    if (!tagNames || tagNames.length === 0) return [];
    const tags = await this.prisma.$transaction(
      tagNames.map((name) => {
        const tagName = name.toLowerCase().trim();
        return this.prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
      }),
    );
    return tags.map((tag) => ({
      tagID: tag.tagID,
    }));
  }

  /**
   * 2. Tạo Ký ức mới. Đã cập nhật để lưu `memoryDate`.
   */
  async createMemory(userId: string, dto: CreateMemoryDto) {
    const { tags: tagNames, ...memoryData } = dto;
    
    // Xử lý tags để lấy ra mảng các ID
    const tagIds = await this.manageTags(tagNames);

    // Tạo bản ghi Memory với dữ liệu trực tiếp từ DTO
    const memory = await this.prisma.memory.create({
      data: {
        user: { connect: { userID: userId } },
        emotion: { connect: { emotionID: memoryData.emotionID } },
        title: memoryData.title,
        content: memoryData.content,
        location: memoryData.location,
        memoryDate: new Date(memoryData.memoryDate), // Lấy chính xác memoryDate
        
        // Kết nối với các tag thông qua bảng trung gian
        memoryTags: {
          create: tagIds.map(tag => ({
            tag: {
              connect: { tagID: tag.tagID }
            }
          }))
        }
      },
      include: {
        emotion: true,
        memoryTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return memory;
  }


  /**
   * 3. Lấy tất cả Ký ức. Đã cập nhật để sắp xếp theo `memoryDate`.
   */
  async getMemories(userId: string) {
    return this.prisma.memory.findMany({
      where: { userID: userId },
      orderBy: { memoryDate: 'desc' }, // <<< THAY ĐỔI Ở ĐÂY
      include: {
        emotion: true,
        media: true,
        memoryTags: {
          select: { tag: { select: { name: true, tagID: true } } },
        },
      },
    });
  }

  /**
   * 4. Lấy một Ký ức bằng ID.
   */
  async getMemoryById(userId: string, memoryId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { memoryID: memoryId },
      include: {
        emotion: true,
        media: true,
        memoryTags: { include: { tag: true } },
      },
    });
    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }
    return memory;
  }

  /**
   * 5. Cập nhật một Ký ức. Đã cập nhật để cho phép sửa `memoryDate`.
   */
  async updateMemoryById(
    userId: string,
    memoryId: string,
    dto: UpdateMemoryDto,
  ) {
    await this.getMemoryById(userId, memoryId);
    const { tags: tagNames, ...memoryData } = dto;
    const tagConnections = await this.manageTags(tagNames);
    return this.prisma.memory.update({
      where: { memoryID: memoryId },
      data: {
        ...memoryData,
        // Cập nhật memoryDate nếu được cung cấp
        memoryDate: memoryData.memoryDate ? new Date(memoryData.memoryDate) : undefined,
        memoryTags: {
          deleteMany: {},
          create: tagConnections,
        },
      },
      include: {
        emotion: true,
        memoryTags: { include: { tag: true } },
      },
    });
  }

  /**
   * 6. Xóa một Ký ức.
   */
  async deleteMemoryById(userId: string, memoryId: string) {
    await this.getMemoryById(userId, memoryId);
    await this.prisma.memory.delete({
      where: { memoryID: memoryId },
    });
    return { message: 'Memory deleted successfully' };
  }

  /**
   * 7. Tạo/Lấy link chia sẻ.
   */
  async createOrGetShareLink(userId: string, memoryId: string) {
    await this.getMemoryById(userId, memoryId);
    const existingLink = await this.prisma.shareLink.findFirst({
      where: {
        memoryID: memoryId,
        access_level: AccessLevel.PUBLIC,
      },
    });
    if (existingLink) {
      return existingLink;
    }
    const newShareLink = await this.prisma.shareLink.create({
      data: {
        memoryID: memoryId,
        access_level: AccessLevel.PUBLIC,
        expiration_date: null,
        url: '',
      },
    });
    return this.prisma.shareLink.update({
      where: { shareID: newShareLink.shareID },
      data: {
        url: newShareLink.shareID,
      },
    });
  }

  /**
   * 8. Thêm media vào Ký ức.
   */
  async addMediaToMemory(
    userId: string,
    memoryId: string,
    files: Array<Express.Multer.File>,
  ) {
    await this.getMemoryById(userId, memoryId);
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required.');
    }
    const uploadPromises = files.map((file) =>
      this.cloudinary.uploadFile(file, `soulnote-memories/${userId}`),
    );
    const uploadResults = await Promise.all(uploadPromises);
    const mediaDataToCreate = uploadResults.reduce((acc, result, index) => {
      const file = files[index];
      const mediaType = file.mimetype.startsWith('image/')
        ? MediaType.IMAGE
        : file.mimetype.startsWith('audio/')
        ? MediaType.AUDIO
        : file.mimetype.startsWith('video/')
        ? MediaType.VIDEO
        : MediaType.DOCUMENT;
      acc.push({
          memoryID: memoryId,
          url: result.secure_url,
          publicId: result.public_id,
          type: mediaType,
      });
      return acc;
    }, [] as Prisma.MediaCreateManyInput[]);
    
    if (mediaDataToCreate.length === 0) {
      throw new BadRequestException(
        'None of the uploaded files were of a supported type.',
      );
    }
    await this.prisma.media.createMany({
      data: mediaDataToCreate,
    });
    return {
      message: `${mediaDataToCreate.length} file(s) uploaded successfully.`,
    };
  }

  /**
   * 9. Xóa media.
   */
  async deleteMedia(userId: string, mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { mediaID: mediaId },
      include: { memory: true },
    });
    if (!media || media.memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }
    await this.cloudinary.deleteFile(media.publicId);
    await this.prisma.media.delete({
      where: { mediaID: mediaId },
    });
    return { message: 'Media deleted successfully.' };
  }
}