import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data]; // Trả về một trường cụ thể (ví dụ: 'email', 'userID')
    }
    return request.user; // Trả về toàn bộ object user
  },
);