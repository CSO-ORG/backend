import { ALERT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { AlertServiceHealthIndicator } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private alertServiceHealthIndicator: AlertServiceHealthIndicator,
  ) {}

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.HEALTHCHECK,
  })
  @HealthCheck()
  check(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.health.check([
      () => this.alertServiceHealthIndicator.isHealthy(),
    ]);
  }
}
