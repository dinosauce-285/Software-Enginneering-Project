import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'; // Dùng AuthGuard của Passport
import { GetUser } from '../auth/decorator/get-user.decorator'; // Import decorator bạn vừa tạo
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(AuthGuard('jwt')) // <-- Áp dụng "Người Gác Cổng" cho TẤT CẢ các route trong controller này
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Endpoint: GET /users/me
   * Mục đích: Lấy thông tin của người dùng đang đăng nhập.
   * Bảo mật: Yêu cầu JWT hợp lệ.
   */
  @Get('me')
  getMe(@GetUser() user: User): Omit<User, 'passwordHash'> {
    // Decorator @GetUser đã lấy sẵn user từ request cho bạn.
    // JwtStrategy cũng đã loại bỏ passwordHash, nhưng để chắc chắn, chúng ta làm lại ở đây.
    const { passwordHash, ...result } = user;
    return result;
  }

  /**
   * Endpoint: PATCH /users/me
   * Mục đích: Cập nhật thông tin của người dùng đang đăng nhập.
   * Bảo mật: Yêu cầu JWT hợp lệ.
   */
  @Patch('me')
  updateUser(
    @GetUser('userID') userId: string, // Lấy userID trực tiếp từ token đã được xác thực
    @Body() dto: UpdateUserDto, // Lấy và validate body của request
  ) {
    return this.usersService.updateUser(userId, dto);
  }
}