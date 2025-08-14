// src/auth/guard/jwt-optional.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('jwt') {
  // Ghi đè phương thức handleRequest
  handleRequest(err, user, info, context) {
    // Không ném lỗi ngay cả khi không có user
    // Chỉ trả về user nếu tồn tại, ngược lại trả về undefined
    return user;
  }
}