// src/reminders/dto/update-reminder.dto.ts
import { IsEnum, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { ReminderFrequency } from '@prisma/client';

export class UpdateReminderDto {
  @IsString() @IsOptional() message?: string;
  @IsEnum(ReminderFrequency) @IsOptional() frequency?: ReminderFrequency;
  @IsDateString() @IsOptional() time?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
}