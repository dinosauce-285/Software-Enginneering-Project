import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class FirebaseAuthDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @IsString()
  @IsOptional()
  display_name?: string;
}