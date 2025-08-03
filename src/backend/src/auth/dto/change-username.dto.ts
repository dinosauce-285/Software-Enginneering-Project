// src/auth/dto/change-username.dto.ts
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ChangeUsernameDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 30)
    @Matches(/^[a-z0-9_]+$/, {
        message: 'Username can only contain lowercase letters, numbers, and underscores.',
    })
    newUsername: string;
}