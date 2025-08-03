// src/auth/dto/change-email.dto.ts

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDto {
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty()
    newEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'Your current password is required to confirm this change.' })
    password: string;
}