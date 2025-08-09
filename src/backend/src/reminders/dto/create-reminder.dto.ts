// src/reminders/dto/create-reminder.dto.ts
import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ReminderFrequency } from '@prisma/client';

export class CreateReminderDto {
  @IsString() @IsNotEmpty() message: string;
  @IsEnum(ReminderFrequency) @IsNotEmpty() frequency: ReminderFrequency;
  @IsDateString() @IsNotEmpty() time: string;
}