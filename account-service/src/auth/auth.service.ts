import {
  ACCOUNT_SERVICE_MESSAGE,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@cso-org/shared';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { JWTCONFIG } from 'src/config/constants';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { promisify } from 'util';
import { CreateUserInputDto } from './dtos/input/create-user.input.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async sendEmailVerification(email: string) {
    const token = this.jwtService.sign(
      { email },
      { secret: JWTCONFIG.emailVerficiationSecret, expiresIn: '4h' },
    );
    const subject = 'CSO PET FINDER | Veuillez vérifier votre adresse e-mail';
    const template = 'email-verification';
    const redirectionUrl = `${
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_WEBSITE_URL
        : process.env.DEPLOYED_WEBSITE_URL
    }/register/complete?token=${token}`;
    const successMessage = ACCOUNT_SERVICE_MESSAGE.VERIFICATION_EMAIL_SENT;

    return this.mailerService
      .sendMail({
        to: email,
        subject,
        template,
        context: {
          redirectionUrl,
        },
      })
      .then(() => {
        return JSON.stringify({
          message: successMessage,
        });
      })
      .catch(() => {
        throw new BadRequestError(
          ACCOUNT_SERVICE_MESSAGE.VERIFICATION_EMAIL_NOT_SENT,
        );
      });
  }

  async sendPasswordResetEmail(email: string) {
    const token = this.jwtService.sign(
      { email },
      { secret: JWTCONFIG.emailVerficiationSecret, expiresIn: '4h' },
    );
    const subject = 'CSO PET FINDER | Réinitialisation de votre mot de passe';
    const template = 'password-reset';
    const redirectionUrl = `${
      process.env.NODE_ENV === 'development'
        ? process.env.LOCAL_WEBSITE_URL
        : process.env.DEPLOYED_WEBSITE_URL
    }/password/reset?token=${token}`;
    const successMessage = ACCOUNT_SERVICE_MESSAGE.PASSWORD_RESET_EMAIL_SENT;

    return this.mailerService
      .sendMail({
        to: email,
        subject,
        template,
        context: {
          redirectionUrl,
        },
      })
      .then(() => {
        return JSON.stringify({
          message: successMessage,
        });
      })
      .catch(() => {
        throw new BadRequestError(
          ACCOUNT_SERVICE_MESSAGE.PASSWORD_RESET_EMAIL_NOT_SENT,
        );
      });
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: JWTCONFIG.emailVerficiationSecret,
      });
      return JSON.stringify(decodedToken);
    } catch (err) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.INVALID_TOKEN);
    }
  }

  async register(data: Partial<CreateUserInputDto>) {
    let decodedToken: any;

    try {
      decodedToken = await this.jwtService.verify(data.token, {
        secret: JWTCONFIG.emailVerficiationSecret,
      });
    } catch (err) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.INVALID_TOKEN);
    }

    if (!decodedToken && !decodedToken.email) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.INVALID_TOKEN);
    }

    const user = await this.usersService.find(decodedToken.email);

    if (user) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.EMAIL_IN_USE);
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(data.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    try {
      const userData: Partial<User> = {
        email: decodedToken.email,
        username: data.username,
        profilePicture: data.profilePicture,
        accountType: data.accountType,
        isEmailVerfied: true,
        password: result,
      };

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newUser = queryRunner.manager.create(User, userData);
        const savedUser = (await queryRunner.manager.save(newUser)) as User;

        // WARNING: I will keep this as a transactional query because it can evolve in the future and include more queries
        await queryRunner.commitTransaction();

        const tokens = await this.generateTokens(
          savedUser.email,
          savedUser.username,
        );

        await this.updateRefreshToken(savedUser, tokens.refreshToken);
        return JSON.stringify(tokens);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_REGISTERED);
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      throw new BadRequestError(err.message);
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedError(
        ACCOUNT_SERVICE_MESSAGE.INCORRECT_CREDENTIALS,
      );
    }

    const tokens = await this.generateTokens(user.email, user.username);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return JSON.stringify(tokens);
  }

  async resetPassword(token: string, newPassword: string) {
    const decodedToken = await this.jwtService.verify(token, {
      secret: JWTCONFIG.emailVerficiationSecret,
    });

    if (!decodedToken) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.INVALID_TOKEN);
    }

    const user = await this.usersService.find(decodedToken.email);
    if (!user) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(newPassword, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    try {
      await this.usersService.update(user, {
        password: result,
        refreshToken: null,
      });
      return JSON.stringify({
        message: ACCOUNT_SERVICE_MESSAGE.PASSWORD_RESET,
      });
    } catch (error) {
      throw new BadRequestError(ACCOUNT_SERVICE_MESSAGE.PASSWORD_NOT_RESET);
    }
  }

  async refreshTokens(email: string, refreshToken: string) {
    const user = await this.usersService.find(email);

    if (!user) {
      throw new ForbiddenError(ACCOUNT_SERVICE_MESSAGE.ACCESS_DENIED);
    }

    if (!user.refreshToken) {
      throw new ForbiddenError(ACCOUNT_SERVICE_MESSAGE.ACCESS_DENIED);
    }
    const [salt, storedHash] = user.refreshToken.split('.');
    const hash = (await scrypt(refreshToken, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new ForbiddenError(ACCOUNT_SERVICE_MESSAGE.ACCESS_DENIED);
    }

    const tokens = await this.generateTokens(user.email, user.username);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return JSON.stringify(tokens);
  }

  async logout(email: string) {
    const user = await this.usersService.find(email);
    await this.usersService.update(user, { refreshToken: null });
    return JSON.stringify({
      message: ACCOUNT_SERVICE_MESSAGE.USER_LOGGED_OUT,
    });
  }

  async generateTokens(email: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
          username,
        },
        {
          secret: JWTCONFIG.accessTokenSecret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          email,
          username,
        },
        {
          secret: JWTCONFIG.refreshTokenSecret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(refreshToken, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    await this.usersService.update(user, { refreshToken: result });
  }
}
