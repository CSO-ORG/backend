import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { REGISTERED_SERVICES } from 'src/config/services';
import { AccountServiceController } from './account-service.controller';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  controllers: [AccountServiceController],
  imports: [ClientsModule.register(REGISTERED_SERVICES)],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AccountServiceModule {}
