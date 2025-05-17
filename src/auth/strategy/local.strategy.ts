import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      // passwordField: 'password',
    });
  }

  // async validate(email: string, password: string): Promise<any> {
  async validate(username: string, password: string) {
    return this.authService.verifyUser(username, password);
    // Here you would typically fetch the user from your database
    // and check the password
    // return { email, password };
  }
}
