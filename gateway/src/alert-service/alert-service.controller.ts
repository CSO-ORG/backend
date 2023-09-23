import { ALERT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Request,
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
import { SearchAlertsInputDto } from './dtos/input/search-alerts.input.dto';
import { UpdateAlertInputDto } from './dtos/input/update-alert.input.dto';
import { AlertOutputDto } from './dtos/output/alert.output.dto';
import { CreateAlertOutputDto } from './dtos/output/create-alert.output.dto';
import { CreateFavoriteOutputDto } from './dtos/output/create-favorite.output.dto';
import { DeleteAlertOutputDto } from './dtos/output/delete-alert.output.dto';
import { DeleteFavoriteOutputDto } from './dtos/output/delete-favorite.output.dto';
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
  @ApiOkResponse({
    type: CreateAlertOutputDto,
  })
  async createAlert(@Body() body: CreateAlertInputDto) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.CREATE_ALERT, body);
  }

  @Post('get-all')
  @HttpCode(200)
  @ApiOkResponse({
    type: PaginationOutputDto,
  })
  async getAlerts(@Body() body: GetAlertsInputDto) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL, body);
  }
  @Post('import-alerts')
  @HttpCode(201)
  @ApiOkResponse({
    type: ImportAlertsOutputDto,
  })
  async importAlerts(@Body() body: ImportAlertsInputDto) {
    console.log('====> [gateway received: ]', body.alerts.length);
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.IMPORT_ALERTS, body);
  }

  @Get('create-elastic-index')
  @HttpCode(201)
  @ApiOkResponse({
    description: 'creates an alert index',
  })
  async createIndex() {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.CREATE_INDEX, {});
  }

  @Get('get-coordinates')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'get all alert coordinates',
  })
  async getCoordinates() {
    return this.sendRequest(
      ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL_COORDINATES,
      {},
    );
  }

  // @Post('get-all-from-elasticsearch')
  // @HttpCode(200)
  // @ApiOkResponse({
  //   type: PaginationOutputDto,
  // })
  // async getAllFromElasticSearch(@Body() body: GetAlertsInputDto) {
  //   return this.sendRequest(
  //     ALERT_SERVICE_MESSAGE_PATTERN.GET_ALL_FROM_ELASTICSEARCH,
  //     body,
  //   );
  // }
  @Post('search')
  @HttpCode(200)
  @ApiOkResponse({
    type: PaginationOutputDto,
  })
  async searchAlerts(@Body() body: SearchAlertsInputDto) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.SEARCH, body);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    type: AlertOutputDto,
  })
  async getAlertById(@Param('id') id: string) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.GET_ALERT, { id });
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: AlertOutputDto,
  })
  async updateAlert(
    @Param('id') id: string,
    @Body() body: UpdateAlertInputDto,
    @Request() req,
  ) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.UPDATE_ALERT, {
      id,
      body,
      user: req.user,
    });
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: DeleteAlertOutputDto,
  })
  async deleteAlert(@Param('id') id: string, @Request() req) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.DELETE_ALERT, {
      id,
      user: req.user,
    });
  }

  @Post(':id/favorite')
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: CreateFavoriteOutputDto,
  })
  async createFavorite(@Request() req, @Param('id') id: string) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.ADD_FAVORITE, {
      id,
      user: req.user,
    });
  }

  @Get('favorites/all')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'get my favorites',
  })
  async getMyFavorites(@Request() req) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.GET_FAVORITES, {
      user: req.user,
    });
  }

  @Delete('favorites/:id')
  @HttpCode(201)
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: DeleteFavoriteOutputDto,
  })
  async deleteFavorite(@Request() req, @Param('id') id: string) {
    return this.sendRequest(ALERT_SERVICE_MESSAGE_PATTERN.DELETE_FAVORITE, {
      id,
      user: req.user,
    });
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
