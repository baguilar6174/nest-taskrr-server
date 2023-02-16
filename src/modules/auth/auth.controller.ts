import { Controller, Post, Body } from '@nestjs/common';
import { User } from '../users/entities';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() validateUserDto: ValidateUserDto): Promise<User> {
    return this.authService.login(validateUserDto);
  }
}
