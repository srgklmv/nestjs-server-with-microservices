import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('User is user guard.', new Date());
    const req = context.switchToHttp().getRequest();
    try {
      const queryLogin = req.query.login;
      const bodyLogin = req.body.login || null;
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      const authLogin = this.jwtService.verify(token).login;
      const access = [bodyLogin, queryLogin].includes(authLogin);
      if (!access) {
        throw new HttpException('Вы не можете управлять чужим профилем!', HttpStatus.BAD_REQUEST);
      }
      return true;
    } catch (e) {
      throw new HttpException('Вы не можете управлять чужим профилем!', HttpStatus.BAD_REQUEST);
    }
  }
}
