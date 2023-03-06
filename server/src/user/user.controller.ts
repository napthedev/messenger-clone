import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/all-users-except-current')
  getAllUsers(@Request() req) {
    return this.service.allUsersExceptCurrent(req.user.id);
  }
}
