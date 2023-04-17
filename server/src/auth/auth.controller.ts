import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginOrRegisterDto } from './dto/login-or-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login-or-register')
  loginOrRegister(@Body() body: LoginOrRegisterDto) {
    return this.auth.loginOrRegister(body);
  }

  @Get('verify-token')
  verifyToken(@Request() req) {
    return { user: req.user };
  }

  @Post('add-push-token')
  addPushToken(@Body('token') token: string, @Request() req) {
    if (token) {
      return this.auth.addPushToken(token, req.user.id);
    }
  }
}
