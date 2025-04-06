import { Injectable, UnauthorizedException } from '@nestjs/common';
// import ms from 'ms';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User, response: Response) {
    const expires = new Date();
    const expiration = this.configService.getOrThrow<string>('JWT_EXPIRATION');
    // expires.setMilliseconds(expires.getMilliseconds() + ms(expiration)); // something wrong in ms
    expires.setMilliseconds(expires.getMilliseconds() + Number(expiration));

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: true,
      expires,
      // sameSite: 'strict',
    });

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      if (!user || typeof user.password !== 'string') {
        throw new UnauthorizedException('Credentials are not valid.');
      }
      const authenticated = await bcrypt.compare(password, user.password);
      // if (!user || typeof user.password !== 'string') {
      //   throw new UnauthorizedException('Credentials are not valid.');
      // }
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}
