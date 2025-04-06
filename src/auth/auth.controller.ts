import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    // This decorator extracts the user from the request object in the context of an HTTP request.
    // It uses the ExecutionContext to switch to the HTTP context and then retrieves the request object.
    // The user is then extracted from the request object and returned.
    // This is useful for getting the authenticated user in a controller method.
    // The decorator can be used in a controller method to easily access the current user.
    // The user is then passed to the AuthService to generate a JWT token.
    // The token is then returned to the client.
    // The client can then use this token to authenticate future requests.
    // The token is then returned to the client.
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }
}
