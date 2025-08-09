import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
export class UpdateUserSettingsDto {
  @IsBoolean() @IsOptional() emailNotificationsEnabled?: boolean;
  @IsInt() @Min(0) @Max(23) @IsOptional() reminderTime?: number;
}