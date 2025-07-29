// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    // Lấy secret key từ biến môi trường
    const secret = process.env.JWT_SECRET;


    if (!secret) {
      throw new Error('JWT_SECRET must be defined in the .env file');
    }

    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }


  async validate(payload: { sub: string; email: string; role: string }) {

    const userExists = await this.prisma.user.findUnique({
      where: { userID: payload.sub },
    });

    if (!userExists) {
      throw new UnauthorizedException('User not found or token is invalid.');
    }


    return payload; 
  }
}