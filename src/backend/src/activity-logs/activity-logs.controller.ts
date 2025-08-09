import { Controller, Get } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly logsService: ActivityLogsService) {}

  @Get()
  getAllLogs() {
    return this.logsService.getAllLogs();
  }
}
