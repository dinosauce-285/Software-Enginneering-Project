import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module'; //
@Module({
  // imports: [PrismaModule],
  imports: [
    PrismaModule,
    ActivityLogsModule, // ✅ thêm dòng này vào mảng imports
  ],
  controllers: [ShareController],
  providers: [ShareService],

  
})
export class ShareModule {}
