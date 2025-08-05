// src/memories/dto/create-sharelink.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateShareLinkDto {
  @IsBoolean()
  @IsOptional()
  expires?: boolean; // Client sẽ gửi: { expires: true } hoặc { expires: false }
}