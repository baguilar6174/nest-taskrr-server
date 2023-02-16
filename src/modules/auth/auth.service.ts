import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities';

import { UsersService } from '../users/users.service';
import { ValidateUserDto } from './dto/login-auth.dto';
import { IPayloadToken } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<User> {
    const { username, password } = validateUserDto;
    const userByUsername = await this.usersService.findBy({
      key: 'username',
      value: username,
    });
    const userByEmail = await this.usersService.findBy({
      key: 'email',
      value: username,
    });
    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) return userByUsername;
    }
    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) return userByEmail;
    }
    return null;
  }

  signJWT({
    payload,
    secret,
    expiresIn,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expiresIn: number | string;
  }): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  async generateJWT(user: User): Promise<any> {
    const getUser = await this.usersService.findOne(user.id);
    const payload: IPayloadToken = {
      role: getUser.role,
      sub: getUser.id,
    };
    return {
      accessToken: this.signJWT({
        payload,
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
      user,
    };
  }

  async login(validateUserDto: ValidateUserDto) {
    const user = await this.validateUser(validateUserDto);
    if (!user) throw new UnauthorizedException(`Credentials are not valid`);
    return this.generateJWT(user);
  }
}
