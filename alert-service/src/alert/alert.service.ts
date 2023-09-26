import {
  ACCOUNT_TYPE,
  ALERT_STATUS,
  BadRequestError,
  GENERIC_MESSAGE,
  IPaginationFilters,
  IUser,
  UnauthorizedError,
} from '@cso-org/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { NotFoundError } from 'rxjs';
import { SCRAPPER_URLS } from 'src/config/constants';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAlertInputDto } from './dtos/input/create-alert.input.dto';
import { GetAlertsInputDto } from './dtos/input/get-alerts.input.dto';
import { ImportAlertsInputDto } from './dtos/input/import-alerts.input.dto';
import { SearchAlertsInputDto } from './dtos/input/search-alerts.input.dto';
import { UpdateAlertInputDto } from './dtos/input/update-alert.input.dto';
import { PaginationOutputDto } from './dtos/output/pagination.output.dto';
import { Alert } from './entities/alert.entity';
dotenv.config();
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

  async indexAlert(alert: Partial<Alert>) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      alert.date = new Date(alert.date);
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updatedAlert.date = new Date(updatedAlert.date);
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

  // async getAllFromElasticsearch(input: Partial<GetAlertsInputDto>) {
  //   const from = (input.page - 1) * input.limit;
  //   const size = input.limit;
  //   try {
  //     const result = await this.elasticsearchService.search({
  //       index: this.index,
  //       from,
  //       size,
  //       query: {
  //         term: { alertType: input?.filters?.alertType },
  //       },
  //     });

  //     const foundAlerts = result.hits.hits.map((hit: any) => hit._source);
  //     return {
  //       result: foundAlerts,
  //       total: result.hits.total['value'],
  //     };
  //   } catch (err) {
  //     this.logger.error(
  //       `[Alert-Service - getAllFromElasticsearch method]: ${err}`,
  //     );
  //     throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
  //   }
  // }

  async searchInElasticsearch(input: Partial<SearchAlertsInputDto>) {
    const { page, limit, filters } = input;
    const from = (page - 1) * limit;
    const size = limit;

    const query: any = {
      bool: {
        must: [
          {
            multi_match: {
              query: filters.searchText || '',
              fields: [
                'description',
                'alertType',
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
        ],
      },
    };

    // Optional filters
    if (filters.alertType) {
      query.bool.must.push({
        match: { 'alertType.keyword': filters.alertType.toLowerCase() },
      });
    }

    if (filters.dateRange && filters.dateRange.length === 2) {
      query.bool.must.push({
        range: {
          alertDate: {
            gte: filters.dateRange[0],
            lte: filters.dateRange[1],
          },
        },
      });
    }

    if (filters.breeds && filters.breeds.length > 0) {
      const lowercaseBreeds = filters.breeds.map((breed) =>
        breed.toLowerCase(),
      );
      query.bool.must.push({ terms: { 'breed.keyword': lowercaseBreeds } });
    }

    if (filters.suspicious !== undefined) {
      query.bool.must.push({ match: { isSuspicious: filters.suspicious } });
    }

    // if (filters.cities && filters.cities.length > 0) {
    //   const lowercaseCities = filters.cities.map((city) => city.toLowerCase());
    //   query.bool.must.push({
    //     nested: {
    //       path: 'location',
    //       query: {
    //         match: { 'location.city.keyword': lowercaseCities },
    //       },
    //     },
    //   });
    // }

    // if (filters.departmentCodes && filters.departmentCodes.length > 0) {
    //   const lowercaseDepartmentCodes = filters.departmentCodes.map((code) =>
    //     code.toLowerCase(),
    //   );
    //   query.bool.must.push({
    //     terms: { 'departmentCode.keyword': lowercaseDepartmentCodes },
    //   });
    // }

    if (filters.species && filters.species.length > 0) {
      const lowercaseSpecies = filters.species.map((specie) =>
        specie.toLowerCase(),
      );
      query.bool.must.push({ terms: { 'specie.keyword': lowercaseSpecies } });
    }

    if (filters.rewardRange && filters.rewardRange.length === 2) {
      query.bool.must.push({
        range: {
          reward: {
            gte: filters.rewardRange[0],
            lte: filters.rewardRange[1],
          },
        },
      });
    }

    const response = await this.elasticsearchService.search({
      index: this.index,
      from,
      size,
      body: {
        query,
      },
    });

    // Process and return the response as needed
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
      if (
        input.status === ALERT_STATUS.PUBLISHED &&
        input.isFromAppUser === true
      ) {
        this.checkRequired(input);
      }

      const newAlert = queryRunner.manager.create(Alert, input);
      const savedAlert = await queryRunner.manager.save(newAlert);
      await queryRunner.commitTransaction();
      // if (
      //   savedAlert.status === ALERT_STATUS.PUBLISHED &&
      //   process.env.ENVIRONMENT === 'PROD'
      // ) {
      //   await this.indexAlert(savedAlert);
      // }
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

  checkRequired(input: Partial<CreateAlertInputDto>) {
    let requiredFields = [
      'publisherId',
      'isFromAppUser',
      'status',
      'alertType',
      'petType',
      'specie',
      'age',
      'ageExpressedIn',
      'sex',
      'breed',
      'height',
      'weight',
      'hair',
      'hasTatoo',
      'hasNecklace',
      'hasMicrochip',
      'isSterilized',
      'location',
      'date',
      'isSuspicious',
    ];

    if (!input.publisherEmail && !input.publisherPhoneNumber) {
      throw new BadRequestError(GENERIC_MESSAGE.MISSING_FIELDS);
    }

    if (input.hasNecklace) {
      requiredFields = [...requiredFields, 'necklaceMaterial', 'necklaceColor'];
    }

    for (const prop of requiredFields) {
      if (!(prop in input)) {
        throw new BadRequestError(GENERIC_MESSAGE.MISSING_FIELDS);
      }
    }

    if (input.location) {
      if (
        !input.location.address &&
        !input.location.city &&
        !input.location.country &&
        !input.location.departmentCode &&
        !input.location.departmentName &&
        !input.location.postalCode &&
        !input.location.coords &&
        !input.location.coords.latitude &&
        !input.location.coords.longitude
      ) {
        throw new BadRequestError(GENERIC_MESSAGE.MISSING_FIELDS);
      }
    }
  }

  async getAllAlerts(
    input: Partial<GetAlertsInputDto>,
  ): Promise<PaginationOutputDto> {
    try {
      const queryBuilder = this.buildQueryFilters(input.filters);

      const [alerts, total] = await queryBuilder
        .skip((input.page - 1) * input.limit)
        .take(input.limit)
        .getManyAndCount();

      return {
        result: alerts,
        total,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - getAllAlerts method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_FOUND);
    }
  }

  buildQueryFilters(filters: IPaginationFilters): SelectQueryBuilder<Alert> {
    const queryBuilder = this.repo.createQueryBuilder('alert');

    if (filters.alertType) {
      queryBuilder.andWhere('LOWER(alert.alertType) = :alertType', {
        alertType: filters.alertType.toLowerCase(),
      });
    }

    queryBuilder.andWhere('LOWER(alert.status) = :status', {
      status: ALERT_STATUS.PUBLISHED.toLowerCase(),
    });

    if (filters.breeds && filters.breeds.length > 0) {
      queryBuilder.andWhere('LOWER(alert.breed) IN (:...breeds)', {
        breeds: filters.breeds.map((b) => b.toLowerCase()),
      });
    }

    if (filters.species && filters.species.length > 0) {
      queryBuilder.andWhere('LOWER(alert.specie) IN (:...species)', {
        species: filters.species.map((specie) => specie.toLowerCase()),
      });
    }

    if (filters.suspicious !== undefined) {
      queryBuilder.andWhere('alert.isSuspicious = :isSuspicious', {
        isSuspicious: filters.suspicious,
      });
    }

    if (filters.cities && filters.cities.length > 0) {
      queryBuilder.andWhere(
        "LOWER(CAST(alert.location AS json)->>'city') IN (:...cities)",
        {
          cities: filters.cities.map((city) => city.toLowerCase()),
        },
      );
    }

    if (filters.departmentCodes && filters.departmentCodes.length > 0) {
      queryBuilder.andWhere(
        `LOWER(CAST(alert.location AS json)->>'departmentCode') IN (:...departmentCodes)`,
        {
          departmentCodes: filters.departmentCodes.map((code) =>
            code.toLowerCase(),
          ),
        },
      );
    }

    if (filters.rewardRange && filters.rewardRange.length === 2) {
      const [minReward, maxReward] = filters.rewardRange;
      queryBuilder.andWhere(
        'alert.reward >= :minReward AND alert.reward <= :maxReward',
        {
          minReward,
          maxReward,
        },
      );
    }
    return queryBuilder;
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
        // if (process.env.ENVIRONMENT === 'PROD') {
        //   await this.bulkIndex(alertEntities);
        // }
        totalSaved += alertEntities.length;
      }
      await queryRunner.commitTransaction();

      this.logger.debug('=====> IMPORTED: ', totalSaved);
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
      user.accountType !== ACCOUNT_TYPE.ADMIN &&
      user.accountType !== ACCOUNT_TYPE.MODERATOR
    ) {
      throw new UnauthorizedError('action.not.authorized');
    }

    try {
      Object.assign(foundAlert, data);
      const updatedUser = await this.repo.save(foundAlert);
      // if (process.env.ENVIRONMENT === 'PROD') {
      //   await this.updateIndexedDocument(updatedUser);
      // }

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
      user.accountType !== ACCOUNT_TYPE.ADMIN &&
      user.accountType !== ACCOUNT_TYPE.MODERATOR
    ) {
      throw new UnauthorizedError('action.not.authorized');
    }

    try {
      await this.repo.remove(foundAlert);
      // if (process.env.ENVIRONMENT === 'PROD') {
      //   await this.deleteIndexedDocument(id);
      // }
      return {
        message: GENERIC_MESSAGE.RESOURCE_DELETED,
      };
    } catch (err) {
      this.logger.error(`[Alert-Service - deleteAlert method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_DELETED);
    }
  }

  async getCoordinates(filters: IPaginationFilters) {
    try {
      const foundAlerts = await this.repo
        .createQueryBuilder('alert')
        .select(['alert.id', 'alert.location'])
        .where('alert.location IS NOT NULL')
        .where('alert.alertType = :alertType', { alertType: filters.alertType })
        .getMany();

      const result = foundAlerts.map((alert) => {
        if (
          alert.location.coords &&
          alert.location.coords.latitude &&
          alert.location.coords.longitude
        ) {
          return {
            id: alert.id,
            c: {
              x: alert?.location?.coords?.longitude,
              y: alert?.location?.coords?.latitude,
            },
          };
        }
      });

      return {
        result,
        total: result.length,
      };
    } catch (err) {
      throw new NotFoundError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
    }
  }

  @Cron('20 11 * * *', {
    name: 'scrapper_cron',
    timeZone: 'Europe/Paris',
  })
  handleCron() {
    const currentDateTime = new Date();
    // call scrappers to launch scrapping;
    const url = `${SCRAPPER_URLS.petAlert}?date=${Date.parse(
      currentDateTime.toString(),
    )}`;
    this.logger.debug('=======> SCRAP URL: ' + url);
    this.httpService.get(url).subscribe((res) => {
      this.logger.debug(
        `======> ${currentDateTime.toLocaleString('fr-FR', {
          timeZone: 'Europe/Paris',
        })}: ${res.data}`,
      );
    });
  }
}
