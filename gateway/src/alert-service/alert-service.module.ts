import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { REGISTERED_SERVICES } from 'src/config/services';
import { AlertServiceController } from './alert-service.controller';

@Module({
  controllers: [AlertServiceController],
  imports: [ClientsModule.register(REGISTERED_SERVICES)],
})
export class AlertServiceModule {}
