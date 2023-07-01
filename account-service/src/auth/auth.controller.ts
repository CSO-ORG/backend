import { ACCOUNT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { handleError } from 'src/handlers/error.handler';
import { AuthService } from './auth.service';
import { BasicLoginInputDto } from './dtos/input/basic-login.input.dto';
import { CreateUserInputDto } from './dtos/input/create-user.input.dto';
import { EmailVerificationInputDto } from './dtos/input/email-verification.input.dto';
import { PasswordResetInputDto } from './dtos/input/password-reset.input.dto';
import { RefreshTokensInputDto } from './dtos/input/refresh-tokens.input.dto';
import { VerifyTokenInputDto } from './dtos/input/verify-token.input.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.SEND_VERIFICATION_EMAIL,
  })
  async sendVerificationEmail(
    @Payload() data: EmailVerificationInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .sendEmailVerification(data.email)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.SEND_PASSWORD_RESET_EMAIL,
  })
  async sendPasswordResetEmail(
    @Payload() data: EmailVerificationInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .sendPasswordResetEmail(data.email)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.VERIFY_TOKEN,
  })
  async verifyToken(
    @Payload() data: VerifyTokenInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .verifyToken(data.token)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.REGISTER,
  })
  async register(
    @Payload() data: CreateUserInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .register(data)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.LOGIN,
  })
  async login(@Payload() data: BasicLoginInputDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .login(data.email, data.password)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.WHOAMI,
  })
  async whoAmI(@Payload() user, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return JSON.stringify(user);
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.RESET_PASSWORD,
  })
  async resetPassword(
    @Payload() data: PasswordResetInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .resetPassword(data.token, data.newPassword)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.REFRESH_TOKENS,
  })
  async refreshTokens(
    @Payload() data: RefreshTokensInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .refreshTokens(data.email, data.refreshToken)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.LOGOUT,
  })
  async logout(@Payload() email: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.authService
      .logout(email)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
