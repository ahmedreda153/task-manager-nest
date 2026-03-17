import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '../../../generated/prisma/enums';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@GetUser('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('updateMe')
  updateMe(@GetUser('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch('updateMyPassword')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Password updated successfully' })
  updateMyPassword(
    @GetUser('id') id: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(id, dto);
  }

  @Delete('deleteMe')
  @HttpCode(204)
  deleteMe(@GetUser('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
