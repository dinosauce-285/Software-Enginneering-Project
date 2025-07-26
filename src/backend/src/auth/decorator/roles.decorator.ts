// src/auth/decorator/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client'; // Import enum Role từ Prisma Client

// Đây là "chìa khóa" để chúng ta có thể tìm lại các vai trò đã được set.
export const ROLES_KEY = 'roles';

// Đây chính là decorator @Roles('ADMIN', 'USER', ...) mà chúng ta sẽ sử dụng.
// Nó nhận vào một danh sách các vai trò (dưới dạng spread operator ...roles).
// SetMetadata sẽ gắn mảng vai trò này vào metadata của route handler với key là ROLES_KEY.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);