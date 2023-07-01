import {
  ACCOUNT_SERVICE_MESSAGE,
  BadRequestError,
  NotFoundError,
} from '@cso-org/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private dataSource: DataSource,
  ) {}
  async findOne(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id: id } });
  }

  async find(email: string): Promise<User | null> {
    const foundUsers = await this.repo.find({
      where: {
        email: email,
      },
    });
    if (foundUsers.length > 0) {
      return foundUsers[0];
    } else {
      return null;
    }
  }

  async update(user: User, attrs: Partial<User>) {
    if (!user) {
      throw new NotFoundError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    Object.assign(user, attrs);

    try {
      const updatedUser = await this.repo.save(user);
      return updatedUser;
    } catch (err) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_UPDATED);
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const removedUser = await this.repo.remove(user);

    return removedUser;
  }

  // async updateUserProfile(data: any, user: User) {
  //   if (!user) {
  //     throw new NotFoundError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_FOUND);
  //   }
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     if (data.firstName && data.lastName) {
  //       await queryRunner.manager.update(User, user.id, {
  //         firstName: data.firstName,
  //         lastName: data.lastName,
  //       });
  //     }

  //     const isSitter = user.accountType === ACCOUNT_TYPE.CLIENT ? false : true;

  //     if (isSitter) {
  //       const profileId = data.profileId;
  //       delete data.profileId;
  //       delete data.firstName;
  //       delete data.lastName;
  //       await queryRunner.manager.update(SitterProfile, profileId, {
  //         ...data,
  //       });
  //     } else {
  //       const profileId = data.profileId;
  //       delete data.profileId;
  //       delete data.firstName;
  //       delete data.lastName;
  //       delete data.dateOfBirth;
  //       delete data.bio;
  //       delete data.spokenLanguages;
  //       delete data.hourlyRate;
  //       delete data.availabilityPeriods;

  //       await queryRunner.manager.update(ClientProfile, profileId, {
  //         ...data,
  //       });
  //     }

  //     await queryRunner.commitTransaction();

  //     return JSON.stringify({
  //       message: ACCOUNT_SERVICE_MESSAGE.PROFILE_UPDATED,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     await queryRunner.rollbackTransaction();
  //     throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.PROFILE_NOT_UPDATED);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
