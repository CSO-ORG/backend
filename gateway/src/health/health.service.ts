import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class GatewayHealthIndicator extends HealthIndicator {
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    const result = this.getStatus('gateway', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Gateway healthcheck failed', result);
  }
}
