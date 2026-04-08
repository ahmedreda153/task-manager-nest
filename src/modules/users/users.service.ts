import { DatabaseService } from '../../database/database.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto, UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  private readonly publicSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return this.databaseService.user.create({
      data: { ...dto, password: hashedPassword },
      select: this.publicSelect,
    });
  }

  async findAll() {
    return this.databaseService.user.findMany({ select: this.publicSelect });
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
      select: this.publicSelect,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findSensitiveByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  async update(
    id: string,
    dto: UpdateUserDto | AdminUpdateUserDto | { refreshToken: string | null },
  ) {
    return this.databaseService.user.update({
      where: { id },
      data: dto,
      select: this.publicSelect,
    });
  }

  async updatePassword(id: string, dto: UpdateUserPasswordDto) {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user || !(await bcrypt.compare(dto.oldPassword, user.password))) {
      throw new UnauthorizedException('Your current password is wrong');
    }
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New password cannot be the same as old');
    }

    const password = await bcrypt.hash(dto.newPassword, 12);
    await this.databaseService.user.update({
      where: { id },
      data: { password },
    });
  }

  async remove(id: string) {
    return this.databaseService.user.delete({ where: { id } });
  }
}
