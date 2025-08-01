import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchMemoryDto {
  @IsString()
  @IsOptional()
  query?: string;

  // Dòng này rất quan trọng để sửa lỗi "uuid is expected"
  // Nó cho phép trường emotions có thể có hoặc không.
  // Nó cũng xác thực rằng mỗi phần tử trong mảng phải là một UUID.
  @IsUUID('4', { each: true })
  @IsOptional()
  // Transform giúp endpoint linh hoạt hơn.
  // Nếu frontend gửi một chuỗi "id1,id2", nó sẽ tự động chuyển thành mảng ['id1', 'id2'].
  // Nếu frontend gửi một mảng, nó sẽ giữ nguyên.
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  emotions?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}