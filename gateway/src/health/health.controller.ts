import {
  ACCOUNT_SERVICE_MESSAGE_PATTERN,
  ALERT_SERVICE_MESSAGE_PATTERN,
} from '@cso-org/shared';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { catchError } from 'rxjs';
import { handleError } from 'src/handlers/error.handler';
import { GatewayHealthIndicator } from './health.service';

@ApiTags('gateway')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private gatewayHealthIndicator: GatewayHealthIndicator,
    @Inject('ACCOUNT_SERVICE') private accountServiceClient: ClientProxy,
    @Inject('ALERT_SERVICE') private alertServiceClient: ClientProxy,
  ) {}

  @Get('/gateway')
  @HealthCheck()
  checkGateway() {
    return this.health.check([() => this.gatewayHealthIndicator.isHealthy()]);
  }

  @Get('/account-service')
  @HealthCheck()
  checkAccountService() {
    return this.accountServiceClient
      .send(
        {
          cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.HEALTHCHECK,
        },
        {},
      )
      .pipe(
        catchError((err) => {
          return handleError(err);
        }),
      );
  }

  @Get('/alert-service')
  @HealthCheck()
  checkAlertService() {
    return this.alertServiceClient
      .send(
        {
          cmd: ALERT_SERVICE_MESSAGE_PATTERN.HEALTHCHECK,
        },
        {},
      )
      .pipe(
        catchError((err) => {
          return handleError(err);
        }),
      );
  }
}
