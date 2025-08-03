// src/auth/dto/delete-account.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
    @IsString()
    @IsNotEmpty({ message: 'Password is required to confirm deletion.' })
    password: string;
}