import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { AlertServiceHealthIndicator } from './health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [AlertServiceHealthIndicator],
})
export class HealthModule {}
