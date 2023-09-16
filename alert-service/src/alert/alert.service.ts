import {
  ACCOUNT_TYPE,
  BadRequestError,
  GENERIC_MESSAGE,
  IUser,
  UnauthorizedError,
} from '@cso-org/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SCRAPPER_URLS } from 'src/config/constants';
import { DataSource, Repository } from 'typeorm';
import { CreateAlertInputDto } from './dtos/input/create-alert.input.dto';
import { GetAlertsInputDto } from './dtos/input/get-alerts.input.dto';
import { ImportAlertsInputDto } from './dtos/input/import-alerts.input.dto';
import { SearchAlertsInputDto } from './dtos/input/search-alerts.input.dto';
import { UpdateAlertInputDto } from './dtos/input/update-alert.input.dto';
import { PaginationOutputDto } from './dtos/output/pagination.output.dto';
import { Alert } from './entities/alert.entity';
@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly batchSize = 100;
  private readonly index = 'alerts';

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Alert) private repo: Repository<Alert>,
    private readonly httpService: HttpService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async createIndex() {
    return this.elasticsearchService.indices.create({ index: this.index });
  }

  async indexAlert(alert: Alert) {
    try {
      const response = await this.elasticsearchService.index({
        index: this.index,
        id: alert.id,
        document: alert,
      });
      return response;
    } catch (err) {
      this.logger.error(`Alert-Service - indexAlert: `, err);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_INDEXED);
    }
  }

  async updateIndexedDocument(updatedAlert: Alert) {
    try {
      await this.elasticsearchService.update({
        index: this.index,
        id: updatedAlert.id,
        refresh: true,
        doc: updatedAlert,
      });
    } catch (err) {
      this.logger.error(`Alert-Service - updateIndexedDocument: `, err);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_UPDATED);
    }
  }

  async deleteIndexedDocument(id: string) {
    console.log('=====> id: ', id);
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id: id,
      });
    } catch (err) {
      this.logger.error(`Alert-Service - deleteIndexedDocument: `, err);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_DELETED);
    }
  }

  async bulkIndex(alerts: Alert[]) {
    try {
      let erroredDocuments = [];
      const operations = alerts.flatMap((alert) => [
        { index: { _index: this.index, _id: alert.id } },
        alert,
      ]);

      const bulkResponse = await this.elasticsearchService.bulk({
        refresh: true,
        operations,
      });

      if (bulkResponse.errors) {
        erroredDocuments = [];
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              // If the status is 429 it means that you can retry the document,
              // otherwise it's very likely a mapping error, and you should
              // fix the document before to try it again.
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });

        return {
          erroredDocuments,
          bulkResponse,
        };
      }

      const count = await this.elasticsearchService.count({
        index: this.index,
      });

      return {
        count,
        bulkResponse,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - bulkIndex method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_INDEXED);
    }
  }

  async getAllFromElasticsearch(input: Partial<GetAlertsInputDto>) {
    const from = (input.page - 1) * input.limit;
    const size = input.limit;
    try {
      const result = await this.elasticsearchService.search({
        index: this.index,
        from,
        size,
        query: {
          term: { alertType: input?.filters?.alertType },
        },
      });

      const foundAlerts = result.hits.hits.map((hit: any) => hit._source);
      return {
        result: foundAlerts,
        total: result.hits.total['value'],
      };
    } catch (err) {
      this.logger.error(
        `[Alert-Service - getAllFromElasticsearch method]: ${err}`,
      );
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
    }
  }

  async search(input: Partial<SearchAlertsInputDto>) {
    const from = (input.page - 1) * input.limit;
    const size = input.limit;

    const response = await this.elasticsearchService.search({
      index: this.index,
      from,
      size,
      body: {
        query: {
          multi_match: {
            query: input?.filters?.searchText ?? '',
            fields: [
              'description',
              'alertType',
              'description',
              'icadIdentifier',
              'petType',
              'specie',
              'sex',
              'breed',
              'hair',
              'height',
              'weight',
            ],
          },
        },
      },
    });

    const hits = response.hits.hits;
    const foundAlerts = hits.map((item) => item._source);

    return {
      result: foundAlerts,
      total: response.hits.total['value'],
    };
  }

  async createAlert(input: Partial<CreateAlertInputDto>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAlert = queryRunner.manager.create(Alert, input);
      const savedAlert = await queryRunner.manager.save(newAlert);
      await queryRunner.commitTransaction();
      await this.indexAlert(savedAlert);

      return {
        message: GENERIC_MESSAGE.RESOURCE_CREATED,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`[Alert-Service - createAlert method]: ${err}`);

      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_CREATED);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllAlerts(
    input: Partial<GetAlertsInputDto>,
  ): Promise<PaginationOutputDto> {
    try {
      const [results, total] = await this.repo.findAndCount({
        where: {
          alertType: input?.filters?.alertType,
        },
        take: input.limit,
        skip: input.limit * (input.page - 1),
      });

      return {
        result: results,
        total: total,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - getAllAlerts method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_FOUND);
    }
  }

  async importAlerts(input: ImportAlertsInputDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let totalSaved = 0;

    try {
      for (let i = 0; i < input.alerts.length; i += this.batchSize) {
        const batch = input.alerts.slice(i, i + this.batchSize);
        const alertEntities = await this.repo.create(batch);
        await queryRunner.manager.save(Alert, alertEntities);
        await this.bulkIndex(alertEntities);
        totalSaved += alertEntities.length;
      }
      await queryRunner.commitTransaction();

      return {
        message: GENERIC_MESSAGE.RESOURCES_IMPORTED,
        totalSavedAlerts: totalSaved,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - importAlerts method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_CREATED);
    }
  }

  async getAlertById(id: string) {
    try {
      const foundAlert = await this.repo.findOne({ where: { id: id } });

      if (!foundAlert) {
        throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
      }

      return foundAlert;
    } catch (err) {
      this.logger.error(`[Alert-Service - getAlertById method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
    }
  }

  async updateAlert(
    id: string,
    data: Partial<UpdateAlertInputDto>,
    user: IUser,
  ) {
    const foundAlert = await this.getAlertById(id);

    if (
      foundAlert.publisherId !== user.id &&
      user.accountType !== ACCOUNT_TYPE.ADMIN
    ) {
      throw new UnauthorizedError('action.not.authorized');
    }

    try {
      Object.assign(foundAlert, data);
      const updatedUser = await this.repo.save(foundAlert);
      await this.updateIndexedDocument(updatedUser);

      return updatedUser;
    } catch (err) {
      this.logger.error(`[Alert-Service - updateAlert method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_UPDATED);
    }
  }

  async deleteAlert(id: string, user: IUser) {
    const foundAlert = await this.getAlertById(id);

    if (
      foundAlert.publisherId !== user.id &&
      user.accountType !== ACCOUNT_TYPE.ADMIN
    ) {
      throw new UnauthorizedError('action.not.authorized');
    }

    try {
      await this.repo.remove(foundAlert);
      await this.deleteIndexedDocument(id);

      return {
        message: GENERIC_MESSAGE.RESOURCE_DELETED,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - deleteAlert method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_DELETED);
    }
  }

  @Cron('49 0 * * *', {
    name: 'scrapper_cron',
    timeZone: 'Europe/Paris',
  })
  handleCron() {
    const currentDateTime = new Date();
    // call scrappers to launch scrapping;
    this.httpService.get(SCRAPPER_URLS.petAlert).subscribe((res) => {
      this.logger.debug(
        `======> ${currentDateTime.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
        })}: ${res.data}`,
      );
    });
  }
}
