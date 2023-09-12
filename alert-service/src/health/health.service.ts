import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class AlertServiceHealthIndicator extends HealthIndicator {
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    const result = this.getStatus('alert-service', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Alert Service healthcheck failed', result);
  }
}
