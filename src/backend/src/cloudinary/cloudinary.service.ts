import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    // Cấu hình Cloudinary khi service được khởi tạo
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(
    file: Express.Multer.File, // Kiểu dữ liệu này sẽ được nhận diện sau khi cài @types/multer
    folder: string,
  ): Promise<UploadApiResponse> { // Chỉ trả về UploadApiResponse khi thành công
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            // Nếu có lỗi, reject promise
            return reject(new InternalServerErrorException(error.message));
          }
          if (!result) {
            // Xử lý trường hợp hiếm gặp khi không có result cũng không có error
            return reject(new InternalServerErrorException('Cloudinary upload failed without an error.'));
          }
          // Nếu thành công, resolve promise với kết quả
          resolve(result);
        },
      );
      // Bắt đầu upload
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(new InternalServerErrorException(error.message));
        }
        // Cloudinary trả về { result: 'ok' } hoặc { result: 'not found' }
        resolve(result as { result: string });
      });
    });
  }
}