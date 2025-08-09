// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { MemoriesModule } from './memories/memories.module';
// import { ReportsModule } from './reports/reports.module';
// import { RemindersModule } from './reminders/reminders.module';
// import { FirebaseModule } from './firebase/firebase.module';
// import { MailModule } from './mail/mail.module';
// import { CloudinaryModule } from './cloudinary/cloudinary.module';
// import { EmotionsModule } from './emotions/emotions.module';

// @Module({
//   imports: [PrismaModule, AuthModule, UsersModule, MemoriesModule, ReportsModule, RemindersModule, FirebaseModule, MailModule, CloudinaryModule, EmotionsModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


// src/app.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config'; // <-- BƯỚC 1: Import ConfigModule

// Import các controller và service cốt lõi
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import tất cả các feature module của bạn
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MemoriesModule } from './memories/memories.module';
import { ReportsModule } from './reports/reports.module';
import { RemindersModule } from './reminders/reminders.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmotionsModule } from './emotions/emotions.module';
import { ShareModule } from './share/share.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';


@Module({
  imports: [
    // BƯỚC 2: Thêm ConfigModule.forRoot() vào ĐẦU mảng imports
    // - forRoot() sẽ đọc file .env
    // - isGlobal: true cho phép mọi module khác (như MailModule)
    //   có thể sử dụng ConfigService mà không cần import lại.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Giữ nguyên các module còn lại của bạn
    PrismaModule,
    AuthModule,
    UsersModule,
    MemoriesModule,
    ReportsModule,
    ScheduleModule.forRoot(),
    RemindersModule,
    FirebaseModule,
    MailModule,
    CloudinaryModule,
    EmotionsModule,
    ShareModule,
    ActivityLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }