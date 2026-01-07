import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(userData: any) {
    const userExists = await this.usersService.findByEmail(userData.email);
    if (userExists) {
      throw new BadRequestException('Bu email adresi zaten kullanımda!');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(loginData: any) {
    const user = await this.usersService.findByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı!');
    }

    const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Hatalı şifre!');
    }

    // Token içeriğine (payload) kullanıcı id ve rolünü koyuyoruz (Ödevdeki rol gereksinimi için kritik)
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}