import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MemoriesModule } from './memories/memories.module';
import { ReportsModule } from './reports/reports.module';
import { RemindersModule } from './reminders/reminders.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MemoriesModule, ReportsModule, RemindersModule, FirebaseModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
