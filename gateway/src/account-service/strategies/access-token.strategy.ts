import { ACCOUNT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { catchError, lastValueFrom } from 'rxjs';
import { JWTCONFIG } from 'src/config/constants';
import { handleError } from 'src/handlers/error.handler';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('ACCOUNT_SERVICE') private accountServiceClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWTCONFIG.accessTokenSecret,
    });
  }

  async validate(payload) {
    const user = await lastValueFrom(
      this.accountServiceClient
        .send(
          { cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.FIND_USER_BY_EMAIL },
          payload.email,
        )
        .pipe(
          catchError((err) => {
            return handleError(err);
          }),
        ),
    );

    return user;
  }
}
