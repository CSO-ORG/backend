import {
  BadRequestError,
  GENERIC_MESSAGE,
  IUser,
  NotFoundError,
} from '@cso-org/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertService } from 'src/alert/alert.service';
import { DataSource, Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Favorite) private repo: Repository<Favorite>,
    private alertService: AlertService,
  ) {}
  async createFavorite(id: string, user: IUser) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const foundAlert = await this.alertService.getAlertById(id);

    try {
      const newFavorite = queryRunner.manager.create(Favorite, {
        userId: user.id,
        alert: foundAlert,
      });
      await queryRunner.manager.save(newFavorite);
      await queryRunner.commitTransaction();

      return {
        message: GENERIC_MESSAGE.RESOURCE_CREATED,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`[Favorite-Service - createFavorite method]: ${err}`);

      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_CREATED);
    } finally {
      await queryRunner.release();
    }
  }

  async getMyFavorites(user: IUser) {
    try {
      const foundFavorites = await this.repo.find({
        relations: ['alert'],
        where: {
          userId: user.id,
        },
      });

      return foundFavorites;
    } catch (err) {
      this.logger.error(`[Favorite-Service - getMyFavorites method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
    }
  }

  async deleteFavorite(id: string, user: IUser) {
    const foundFavorite = await this.repo.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!foundFavorite) {
      throw new NotFoundError(GENERIC_MESSAGE.RESOURCE_NOT_FOUND);
    }

    try {
      await this.repo.remove(foundFavorite);
      return {
        message: GENERIC_MESSAGE.RESOURCE_DELETED,
      };
    } catch (err) {
      this.logger.error(`[Favorite-Service - deleteFavorite method]: ${err}`);
      throw new BadRequestError(GENERIC_MESSAGE.RESOURCE_DELETED);
    }
  }
}
