import { ALERT_SERVICE_MESSAGE_PATTERN, IUser } from '@cso-org/shared';
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
import { SearchAlertsInputDto } from './dtos/input/search-alerts.input.dto';
import { UpdateAlertInputDto } from './dtos/input/update-alert.input.dto';

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
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL_COORDINATES,
  })
  async getCoordinates(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .getCoordinates()
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

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.CREATE_INDEX,
  })
  async createIndex(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .createIndex()
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  // @MessagePattern({
  //   cmd: ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL_FROM_ELASTICSEARCH,
  // })
  // async getAllFromElasticSearch(
  //   @Payload() input: GetAlertsInputDto,
  //   @Ctx() context: RmqContext,
  // ) {
  //   const channel = context.getChannelRef();
  //   const message = context.getMessage();
  //   channel.ack(message);
  //   return this.alertService
  //     .getAllFromElasticsearch(input)
  //     .then((res) => {
  //       return res;
  //     })
  //     .catch((err) => {
  //       handleError(err);
  //     });
  // }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.SEARCH,
  })
  async searchAlerts(
    @Payload() input: SearchAlertsInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .searchInElasticsearch(input)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.GET_ALERT,
  })
  async getAlertById(
    @Payload() input: { id: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .getAlertById(input.id)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.UPDATE_ALERT,
  })
  async updateAlert(
    @Payload() input: { id: string; body: UpdateAlertInputDto; user: IUser },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .updateAlert(input.id, input.body, input.user)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.DELETE_ALERT,
  })
  async deleteAlert(
    @Payload() input: { id: string; user: IUser },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.alertService
      .deleteAlert(input.id, input.user)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
