import { ACCOUNT_SERVICE_MESSAGE } from '@cso-org/shared';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info && info.name === 'TokenExpiredError') {
      throw new UnprocessableEntityException(
        ACCOUNT_SERVICE_MESSAGE.TOKEN_EXPIRED,
      );
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
