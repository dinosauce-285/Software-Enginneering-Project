import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ReportsService } from './reports.service';
import { GetReportDto } from './dto/get-report.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('emotions')
  getEmotionReport(
    @GetUser('userID') userId: string,
    @Query() dto: GetReportDto,
  ) {
    // Chuyển đổi chuỗi từ client thành đối tượng Date
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    return this.reportsService.getEmotionReport(userId, startDate, endDate);
  }
}