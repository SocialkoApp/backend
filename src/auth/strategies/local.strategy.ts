import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) {
    super();
  }

  async validate(authLoginDto: AuthLoginDto): Promise<any> {
    const user = await this.auth.validateUser(authLoginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
