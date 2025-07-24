import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { AccessLevel, Prisma } from '@prisma/client'; // Import Enum từ Prisma Client
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService,) {}

  /**
   * Hàm helper để xử lý việc "tìm hoặc tạo" các tags.
   * Nhận vào một mảng tên tag, trả về một mảng các object chứa tagID.
   */
  private async manageTags(tagNames: string[] | undefined) {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
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

    // Trả về mảng các object để dùng trong lệnh connect của Prisma
    return tags.map((tag) => ({
      tag: {
        connect: {
          tagID: tag.tagID,
        },
      },
    }));
  }

  /**
   * 1. Tạo một kỷ niệm mới, bao gồm cả việc xử lý tags.
   */
  async createMemory(userId: string, dto: CreateMemoryDto) {
    const { tags: tagNames, ...memoryData } = dto;

    // Xử lý các tag để lấy ra danh sách object connect
    const tagConnections = await this.manageTags(tagNames);

    const memory = await this.prisma.memory.create({
      data: {
        userID: userId,
        ...memoryData, // Gồm title, content, emotionID
        memoryTags: {
          create: tagConnections, // Tạo các liên kết trong bảng MemoryTag
        },
      },
      // Lấy kèm thông tin chi tiết để trả về cho client
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
   * 2. Lấy tất cả kỷ niệm của một người dùng.
   */
  async getMemories(userId: string) {
    return this.prisma.memory.findMany({
      where: {
        userID: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
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

  /**
   * 3. Lấy một kỷ niệm cụ thể bằng ID.
   */
  async getMemoryById(userId: string, memoryId: string) {
    const memory = await this.prisma.memory.findUnique({
      where: {
        memoryID: memoryId,
      },
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

    // Nếu không tìm thấy hoặc kỷ niệm không thuộc về người dùng này -> Lỗi
    if (!memory || memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied');
    }

    return memory;
  }

  /**
   * 4. Cập nhật một kỷ niệm, bao gồm cả việc ghi đè tags.
   */
  async updateMemoryById(
    userId: string,
    memoryId: string,
    dto: UpdateMemoryDto,
  ) {
    // Kiểm tra quyền sở hữu trước
    await this.getMemoryById(userId, memoryId);

    const { tags: tagNames, ...memoryData } = dto;

    // Xử lý các tag mới
    const tagConnections = await this.manageTags(tagNames);

    return this.prisma.memory.update({
      where: { memoryID: memoryId },
      data: {
        ...memoryData,
        // Cập nhật tags bằng cách: xóa tất cả liên kết cũ và tạo lại các liên kết mới
        memoryTags: {
          deleteMany: {}, // Xóa tất cả MemoryTag liên quan đến memoryId này
          create: tagConnections, // Tạo lại các liên kết mới
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

  /**
   * 5. Xóa một kỷ niệm.
   */
  async deleteMemoryById(userId: string, memoryId: string) {
    // Kiểm tra quyền sở hữu
    await this.getMemoryById(userId, memoryId);

    // Prisma sẽ tự động xóa các bản ghi liên quan trong MemoryTag, Media, ShareLink
    // nhờ có `onDelete: Cascade` trong schema.
    await this.prisma.memory.delete({
      where: {
        memoryID: memoryId,
      },
    });

    return { message: 'Memory deleted successfully' };
  }
  // === HÀM MỚI ĐƯỢC THÊM VÀO / CẬP NHẬT ===
  /**
   * Tạo (hoặc lấy) một link chia sẻ công khai, không hết hạn cho một ký ức.
   * Logic này hiệu quả hơn vì nó không tạo ra các link bị trùng lặp.
   */
  async createOrGetShareLink(userId: string, memoryId: string) {
    // 1. Kiểm tra quyền sở hữu của người dùng đối với ký ức này
    await this.getMemoryById(userId, memoryId);

    // 2. Tìm xem đã có link PUBLIC nào tồn tại cho ký ức này chưa
    const existingLink = await this.prisma.shareLink.findFirst({
      where: {
        memoryID: memoryId,
        access_level: AccessLevel.PUBLIC, // Chỉ tìm link công khai
      },
    });

    // 3. Nếu đã có, trả về link cũ ngay lập tức
    if (existingLink) {
      return existingLink;
    }

    // 4. Nếu chưa có, tạo một link mới
    const newShareLink = await this.prisma.shareLink.create({
      data: {
        memoryID: memoryId,
        access_level: AccessLevel.PUBLIC, // Luôn là PUBLIC
        expiration_date: null, // Không bao giờ hết hạn
        url: '', // Sẽ được cập nhật ngay sau đây
      },
    });

    // 5. Dùng chính shareID (là một UUID) để làm URL cho bảo mật và duy nhất
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
    // 1. Kiểm tra quyền sở hữu memory
    await this.getMemoryById(userId, memoryId);
    
    // 2. Kiểm tra xem có file nào được gửi lên không
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required.');
    }

    // 3. Upload tất cả các file lên Cloudinary một cách song song
    const uploadPromises = files.map(file => 
      this.cloudinary.uploadFile(file, `soulnote-memories/${userId}`)
    );
    
    // Đợi cho tất cả các file upload xong
    const uploadResults = await Promise.all(uploadPromises);

    // 4. Chuẩn bị dữ liệu để ghi vào database
    const mediaDataToCreate = uploadResults.reduce((acc, result, index) => {
      const file = files[index];
      const mediaType = file.mimetype.startsWith('image/') ? MediaType.IMAGE
                      : file.mimetype.startsWith('audio/') ? MediaType.AUDIO
                      : file.mimetype.startsWith('video/') ? MediaType.VIDEO
                      : file.mimetype.includes('pdf') || file.mimetype.includes('document') ? MediaType.DOCUMENT
                      : null;
      
      // Chỉ thêm vào mảng kết quả nếu mediaType hợp lệ
      if (mediaType) {
        acc.push({
          memoryID: memoryId,
          url: result.secure_url,
          publicId: result.public_id,
          type: mediaType,
        });
      }

      return acc;
    }, [] as Prisma.MediaCreateManyInput[]); // <-- Khai báo kiểu ban đầu cho accumulator

    if (mediaDataToCreate.length === 0) {
      throw new BadRequestException('None of the uploaded files were of a supported type.');
    }

    // 5. Ghi tất cả các bản ghi media vào database
    // Bây giờ TypeScript đã chắc chắn mediaDataToCreate không chứa null
    await this.prisma.media.createMany({
      data: mediaDataToCreate,
    });

    // Trả về một thông báo thành công
    return { message: `${mediaDataToCreate.length} file(s) uploaded successfully.` };
  }

  // Xóa Media khỏi Memory
  async deleteMedia(userId: string, mediaId: string) {
    const media = await this.prisma.media.findUnique({
      where: { mediaID: mediaId },
      include: { memory: true },
    });

    if (!media || media.memory.userID !== userId) {
      throw new ForbiddenException('Access to resource denied.');
    }

    // Xóa file trên Cloudinary trước
    await this.cloudinary.deleteFile(media.publicId);

    // Sau đó xóa bản ghi trong DB
    await this.prisma.media.delete({
      where: { mediaID: mediaId },
    });

    return { message: 'Media deleted successfully.' };
  }
}