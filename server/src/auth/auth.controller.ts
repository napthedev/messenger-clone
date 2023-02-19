import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginOrRegisterDto } from './dto/login-or-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login-or-register')
  async loginOrRegister(@Body() body: LoginOrRegisterDto) {
    return await this.auth.loginOrRegister(body);
  }

  @Get('verify-token')
  async verifyToken(@Request() req) {
    return { user: req.user };
  }
}
