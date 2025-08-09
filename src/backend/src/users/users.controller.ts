// import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { AuthGuard } from '@nestjs/passport'; // Dùng AuthGuard của Passport
// import { GetUser } from '../auth/decorator/get-user.decorator'; // Import decorator bạn vừa tạo
// import { User } from '@prisma/client';
// import { UpdateUserDto } from './dto/update-user.dto';

// // import { Param } from '@nestjs/common';
// // import { JwtService } from '@nestjs/jwt';

// @UseGuards(AuthGuard('jwt')) // <-- Áp dụng "Người Gác Cổng" cho TẤT CẢ các route trong controller này
// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService, /*private readonly jwtService: JwtService,*/) {}

// //   @Get('test-token/:userId')
// //   getTestToken(@Param('userId') userId: string) {
// //     // Tạo payload cho token, cấu trúc phải khớp với những gì JwtStrategy mong đợi
// //     const payload = { sub: userId, email: `test-${userId}@soulnote.com` };
    
// //     // Dùng JwtService để ký và tạo ra chuỗi token
// //     const token = this.jwtService.sign(payload, {
// //       secret: process.env.JWT_SECRET, // Đọc key bí mật từ file .env
// //       expiresIn: '1h', // Token sẽ có hiệu lực trong 1 giờ
// //     });
    
// //     // Trả về token cho bạn
// //     return { accessToken: token };
// //   } 
//   /**
//    * Endpoint: GET /users/me
//    * Mục đích: Lấy thông tin của người dùng đang đăng nhập.
//    * Bảo mật: Yêu cầu JWT hợp lệ.
//    */
//   //@UseGuards(AuthGuard('jwt'))
//   @Get('me')
//   getMe(@GetUser() user: User): Omit<User, 'passwordHash'> {
//     // Decorator @GetUser đã lấy sẵn user từ request cho bạn.
//     // JwtStrategy cũng đã loại bỏ passwordHash, nhưng để chắc chắn, chúng ta làm lại ở đây.
//     const { passwordHash, ...result } = user;
//     return result;
//   }

//   /**
//    * Endpoint: PATCH /users/me
//    * Mục đích: Cập nhật thông tin của người dùng đang đăng nhập.
//    * Bảo mật: Yêu cầu JWT hợp lệ.
//    */
//   //@UseGuards(AuthGuard('jwt'))
//   @Patch('me')
//   updateUser(
//     @GetUser('userID') userId: string, // Lấy userID trực tiếp từ token đã được xác thực
//     @Body() dto: UpdateUserDto, // Lấy và validate body của request
//   ) {
//     return this.usersService.updateUser(userId, dto);
//   }
// }



// src/users/users.controller.ts
import { Body, Controller, Get, Patch, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorator/roles.decorator'; // Import decorator mới
import { RolesGuard } from '../auth/guard/roles.guard';   // Import guard mới
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserSettingsDto } from './dto/update-settings.dto';

@UseGuards(AuthGuard('jwt')) // Áp dụng AuthGuard cho tất cả các route
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint: GET /users/me
   * Lấy thông tin của người dùng đang đăng nhập.
   */
  @Get('me')
  getMe(@GetUser() user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Endpoint: PATCH /users/me
   * Cập nhật thông tin của người dùng đang đăng nhập.
   */
  @Patch('me')
  updateMe(
    @GetUser('userID') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, dto);
  }

  // --- ENDPOINT MỚI DÀNH CHO ADMIN ---
  /**
   * Endpoint: GET /users
   * Lấy danh sách tất cả người dùng (chỉ dành cho Admin).
   */
  @Get()
  @Roles(Role.ADMIN) // << "Biển báo": Chỉ ADMIN mới được vào
  @UseGuards(RolesGuard) // << "Gác cổng": Dùng RolesGuard để kiểm tra "biển báo"
  getAllUsers() {
    return this.usersService.getUsers();
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar')) // Nhận file có tên trường là 'avatar'
  uploadAvatar(
    @GetUser('userID') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // Giới hạn 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }

  @Patch('me/settings')
  updateMySettings(
    @GetUser('userID') userId: string,
    @Body() dto: UpdateUserSettingsDto
  ) {
    return this.usersService.updateSettings(userId, dto);
  }
}