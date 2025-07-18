import { IsArray, IsUUID } from 'class-validator';

export class ManageTagsDto {
  @IsArray()
  @IsUUID('all', { each: true }) // Đảm bảo mỗi phần tử trong mảng là một UUID
  tagIds: string[];
}