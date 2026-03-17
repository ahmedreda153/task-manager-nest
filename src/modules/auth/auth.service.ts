import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.genAuthTokens(user.id, user.role, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findSensitiveByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.genAuthTokens(user.id, user.role, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: JwtTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new ForbiddenException();
    }

    const user = await this.usersService.findSensitiveByEmail(payload.email);
    if (
      !user ||
      !user.refreshToken ||
      !(await bcrypt.compare(refreshToken, user.refreshToken))
    ) {
      throw new ForbiddenException();
    }

    const tokens = await this.genAuthTokens(user.id, user.role, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    const hashed = refreshToken ? await bcrypt.hash(refreshToken, 12) : null;
    await this.usersService.update(userId, { refreshToken: hashed });
  }

  private async genAuthTokens(userId: string, role: string, email: string) {
    const payload = { sub: userId, role, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRY'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
