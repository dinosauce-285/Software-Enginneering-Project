import { Module } from '@nestjs/common';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, ActivityLogsModule,],
  controllers: [MemoriesController],
  providers: [MemoriesService]
})
export class MemoriesModule {}
