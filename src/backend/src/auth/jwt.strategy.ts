// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client'; // Import Role

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // --- HÀM VALIDATE ĐÃ ĐƯỢỢC CẬP NHẬT ---
  // Payload giờ đây sẽ chứa thêm `role`
  async validate(payload: { sub: string; email: string; role: Role }) {
    const user = await this.prisma.user.findUnique({
      where: { userID: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    
    // Chúng ta trả về toàn bộ object user, vì nó đã chứa role.
    // Việc loại bỏ passwordHash sẽ được thực hiện ở controller hoặc service
    // để đảm bảo req.user luôn đầy đủ thông tin cho các Guard.
    return user;
  }
}