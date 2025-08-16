// import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
// export class UpdateUserSettingsDto {
//   @IsBoolean() @IsOptional() emailNotificationsEnabled?: boolean;
//   @IsInt() @Min(0) @Max(23) @IsOptional() reminderTime?: number;
// }

// File: src/users/dto/update-user-settings.dto.ts
// NỘI DUNG CUỐI CÙNG VÀ CHÍNH XÁC

import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserSettingsDto {
  /**
   * Cho phép hoặc vô hiệu hóa thông báo qua email.
   * Đây là một trường tùy chọn.
   */
  @IsBoolean()
  @IsOptional()
  emailNotificationsEnabled?: boolean;

  /**
   * Thời gian nhắc nhở hàng ngày, phải có định dạng "HH:mm".
   * Đây là một trường tùy chọn.
   */
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Reminder time must be in HH:mm format',
  })
  @IsOptional() // Thêm @IsOptional vì người dùng có thể chỉ muốn bật/tắt thông báo
  reminderTime?: string;
}