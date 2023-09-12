import { BadRequestError, GENERIC_MESSAGE } from '@cso-org/shared';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SCRAPPER_URLS } from 'src/config/constants';
import { DataSource, Repository } from 'typeorm';
import { CreateAlertInputDto } from './dtos/input/create-alert.input.dto';
import { GetAlertsInputDto } from './dtos/input/get-alerts.input.dto';
import { ImportAlertsInputDto } from './dtos/input/import-alerts.input.dto';
import { PaginationOutputDto } from './dtos/output/pagination.output.dto';
import { Alert } from './entities/alert.entity';
@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly batchSize = 100;

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Alert) private repo: Repository<Alert>,
    private readonly httpService: HttpService,
  ) {}

  async createAlert(input: Partial<CreateAlertInputDto>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAlert = queryRunner.manager.create(Alert, input);
      await queryRunner.manager.save(newAlert);
      await queryRunner.commitTransaction();

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
          alertType: input.filters.alertType,
        },
        take: input.limit,
        skip: input.limit * input.page,
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
      console.log('======> [alerts.length]: ', input.alerts.length);
      for (let i = 0; i < input.alerts.length; i += this.batchSize) {
        const batch = input.alerts.slice(i, i + this.batchSize);
        const alertEntities = await this.repo.create(batch);
        await queryRunner.manager.save(Alert, alertEntities);
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
