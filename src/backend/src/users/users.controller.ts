import {
  Controller,
  Get,
  Query,
  UseGuards,
  Patch,
  Param,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserSettingsDto } from './dto/update-settings.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('role') role: 'ADMIN' | 'USER',
  ) {
    return this.usersService.findAll({
      page: page ? +page : 1,
      limit: limit ? +limit : 8,
      search,
      role,
    });
  }

  @Patch('me/settings')
  updateMySettings(
    @GetUser('userID') userId: string,
    @Body() dto: UpdateUserSettingsDto,
  ) {
    return this.usersService.updateSettings(userId, dto);
  }

  @Post('me/avatar')
  // Dùng UseGuards riêng cho endpoint này vì nó không cần RolesGuard
  @UseGuards(AuthGuard('jwt')) 
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @GetUser('userID') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    ) file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}