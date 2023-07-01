import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { REGISTERED_SERVICES } from 'src/config/services';
import { HealthController } from './health.controller';
import { GatewayHealthIndicator } from './health.service';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    ClientsModule.register(REGISTERED_SERVICES),
  ],
  controllers: [HealthController],
  providers: [GatewayHealthIndicator],
})
export class HealthModule {}
