import { ALERT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { handleError } from 'src/handlers/error.handler';
import { CreateAlertInputDto } from './dtos/input/create-alert.input.dto';
import { GetAlertsInputDto } from './dtos/input/get-alerts.input.dto';
import { ImportAlertsInputDto } from './dtos/input/import-alerts.input.dto';
import { CreateAlertOutputDto } from './dtos/output/create-alert.output.dto';
import { ImportAlertsOutputDto } from './dtos/output/import-alerts.output.dto';
import { PaginationOutputDto } from './dtos/output/pagination.output.dto';

@ApiTags('alert service')
@Controller({
  path: 'alert-svc',
})
export class AlertServiceController {
  constructor(
    @Inject('ALERT_SERVICE') private alertServiceClient: ClientProxy,
  ) {}

  @Post('create')
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateAlertOutputDto,
  })
  async createAlert(@Body() body: CreateAlertInputDto) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.CREATE_ALERT, body);
  }

  @Post('import-alerts')
  @HttpCode(201)
  @ApiOkResponse({
    type: ImportAlertsOutputDto,
  })
  async importAlerts(@Body() body: ImportAlertsInputDto) {
    console.log('[=====> Gateway]: ', body.alerts.length);
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.IMPORT_ALERTS, body);
  }
  @Post('get-all')
  @HttpCode(200)
  @ApiOkResponse({
    type: PaginationOutputDto,
  })
  async getAlerts(@Body() body: GetAlertsInputDto) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL, body);
  }

  sendRequest(msgPattern: ALERT_SERVICE_MESSAGE_PATTERN, payload: any) {
    return this.alertServiceClient
      .send(
        {
          cmd: msgPattern,
        },
        payload,
      )
      .pipe(
        catchError((err) => {
          return handleError(err);
        }),
      );
  }
}
