import { ALERT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { handleError } from 'src/handlers/error.handler';
import { AlertService } from './alert.service';
import { CreateAlertInputDto } from './dtos/input/create-alert.input.dto';
import { GetAlertsInputDto } from './dtos/input/get-alerts.input.dto';
import { ImportAlertsInputDto } from './dtos/input/import-alerts.input.dto';

@Controller()
export class AlertController {
  constructor(private alertService: AlertService) {}

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.CREATE_ALERT,
  })
  async createAlert(
    @Payload() input: CreateAlertInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .createAlert(input)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL,
  })
  async getAllAlerts(
    @Payload() input: GetAlertsInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .getAllAlerts(input)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.IMPORT_ALERTS,
  })
  async importAlerts(
    @Payload() input: ImportAlertsInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .importAlerts(input)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
