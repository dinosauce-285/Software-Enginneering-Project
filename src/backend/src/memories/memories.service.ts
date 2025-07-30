import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AccessLevel, Prisma, MediaType } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class MemoriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  private async manageTags(tagNames: string[] | undefined) {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }
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
      tag: {
        connect: {
          tagID: tag.tagID,
        },
      },
    }));
  }

  async createMemory(userId: string, dto: CreateMemoryDto) {
    const { tags: tagNames, ...memoryData } = dto;
    const tagConnections = await this.manageTags(tagNames);


    const memory = await this.prisma.memory.create({
      data: {
        userID: userId,
        ...memoryData,
        memoryTags: {
          create: tagConnections,
        },
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

  async getMemories(userId: string) {
    return this.prisma.memory.findMany({
      where: { userID: userId },
      orderBy: { created_at: 'desc' },
      include: {
        emotion: true,
        media: true,
        memoryTags: {
          select: {
            tag: {
              select: {
                name: true,
                tagID: true,
              },
            },
          },
        },
      },
    });
  }

  async getMemoryById(userId: string, memoryId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: { memoryID: memoryId },
      include: {
        emotion: true,
        media: true,
        memoryTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return memory;
  }

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
        memoryTags: {
          deleteMany: {},
          create: tagConnections,
        },
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
  }

  async deleteMemoryById(userId: string, memoryId: string) {
    await this.getMemoryById(userId, memoryId);
    await this.prisma.memory.delete({
      where: { memoryID: memoryId },
    });
    return { message: 'Memory deleted successfully' };
  }
  
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

    const finalLink = await this.prisma.shareLink.update({
      where: { shareID: newShareLink.shareID },
      data: {
        url: newShareLink.shareID,
      },
    });

    return finalLink;
  }

  async addMediaToMemory(
    userId: string,
    memoryId: string,
    files: Array<Express.Multer.File>,
  ) {
    await this.getMemoryById(userId, memoryId);
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required.');
    }

    const uploadPromises = files.map(file => 
      this.cloudinary.uploadFile(file, `soulnote-memories/${userId}`)
    );
    const uploadResults = await Promise.all(uploadPromises);

    const mediaDataToCreate = uploadResults.reduce((acc, result, index) => {
      const file = files[index];
      const mediaType = file.mimetype.startsWith('image/') ? MediaType.IMAGE
                      : file.mimetype.startsWith('audio/') ? MediaType.AUDIO
                      : file.mimetype.startsWith('video/') ? MediaType.VIDEO
                      : file.mimetype.includes('pdf') || file.mimetype.includes('document') ? MediaType.DOCUMENT
                      : null;
      if (mediaType) {
        acc.push({
          memoryID: memoryId,
          url: result.secure_url,
          publicId: result.public_id,
          type: mediaType,
        });
      }
      return acc;
    }, [] as Prisma.MediaCreateManyInput[]);

    if (mediaDataToCreate.length === 0) {
      throw new BadRequestException('None of the uploaded files were of a supported type.');
    }

    await this.prisma.media.createMany({
      data: mediaDataToCreate,
    });

    return { message: `${mediaDataToCreate.length} file(s) uploaded successfully.` };
  }

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