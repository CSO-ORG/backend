import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { AccountServiceHealthIndicator } from './health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [AccountServiceHealthIndicator],
})
export class HealthModule {}
