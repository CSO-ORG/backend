import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class AccountServiceHealthIndicator extends HealthIndicator {
  async isHealthy(): Promise<HealthIndicatorResult> {
    const isHealthy = true;
    const result = this.getStatus('account-service', isHealthy);

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('Account Service healthcheck failed', result);
  }
}
