import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetReportDto {
  @IsDateString({}, { message: 'startDate must be a valid ISO date string.' })
  @IsNotEmpty()
  startDate: string;

  @IsDateString({}, { message: 'endDate must be a valid ISO date string.' })
  @IsNotEmpty()
  endDate: string;
}