import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert]), HttpModule],
  controllers: [AlertController],
  providers: [AlertService],
})
export class AlertModule {}
