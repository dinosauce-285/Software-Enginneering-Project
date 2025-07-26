// src/auth/guard/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector là một công cụ giúp chúng ta đọc được metadata đã được gắn vào route handler
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách các vai trò được yêu cầu từ "biển báo" @Roles
    // this.reflector.getAllAndOverride<Role[]> đọc metadata với key là ROLES_KEY
    // từ cả route handler và controller.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Nếu không có "biển báo" @Roles nào, có nghĩa là endpoint này không yêu cầu vai trò cụ thể.
    // Trong trường hợp này, chúng ta cho phép truy cập (việc xác thực token đã được AuthGuard lo).
    if (!requiredRoles) {
      return true;
    }

    // 3. Lấy thông tin người dùng từ request.
    // (Lưu ý: req.user này được tạo ra bởi JwtStrategy của bạn sau khi xác thực token thành công).
    const { user } = context.switchToHttp().getRequest();

    // 4. So sánh vai trò của người dùng với danh sách vai trò được yêu cầu.
    // Dùng `some` để kiểm tra xem vai trò của user có nằm trong mảng requiredRoles hay không.
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}