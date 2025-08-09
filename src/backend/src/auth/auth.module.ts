// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    FirebaseModule,
    MailModule,
    ActivityLogsModule, // ✅ thêm dòng này
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

  ],
  controllers: [AuthController],

  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }