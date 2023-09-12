import {
  ACCOUNT_SERVICE_MESSAGE,
  ACCOUNT_SERVICE_MESSAGE_PATTERN,
} from '@cso-org/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import { handleError } from 'src/handlers/error.handler';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BasicLoginInputDto } from './dtos/input/basic-login.input.dto';
import { CreateUserInputDto } from './dtos/input/create-user.input.dto';
import { EmailVerificationInputDto } from './dtos/input/email-verification.input.dto';
import { PasswordResetInputDto } from './dtos/input/password-reset.input.dto';
import { RemoveImageInputDto } from './dtos/input/RemoveImageInputDto';
import { UploadImageInputDto } from './dtos/input/UploadImageInputDto';
import { VerifyTokenInputDto } from './dtos/input/verify-token.input.dto';
import { CreateUserOutputDto } from './dtos/output/create-user.output.dto';
import { EmailVerificationOutputDto } from './dtos/output/email-verification.output.dto';
import { LoginOutputDto } from './dtos/output/login.output.dto';
import { LogoutOutputDto } from './dtos/output/logout.output.dto';
import { PasswordEmailVerificationOutputDto } from './dtos/output/password-reset-email-verification.output.dto';
import { PasswordResetOutputDto } from './dtos/output/password-reset.output.dto';
import { RefreshTokensOutputDto } from './dtos/output/refresh-tokens.output.dto';
import { RemoveImageOutputDto } from './dtos/output/remove-image.output.dto';
import { UploadImageOutputDto } from './dtos/output/upload-image.output.dto';
import { UserOutputDto } from './dtos/output/user.output.dto';

@ApiTags('account service')
@Controller({
  path: '/account-svc',
})
export class AccountServiceController {
  constructor(
    @Inject('ACCOUNT_SERVICE') private accountServiceClient: ClientProxy,
  ) {}

  @Post('/send-verification-email')
  @HttpCode(200)
  @ApiOkResponse({
    type: EmailVerificationOutputDto,
  })
  async sendVerificationEmail(@Body() body: EmailVerificationInputDto) {
    return this.sendRequest(
      ACCOUNT_SERVICE_MESSAGE_PATTERN.SEND_VERIFICATION_EMAIL,
      body,
    );
  }

  @Post('/send-password-reset-email')
  @HttpCode(200)
  @ApiOkResponse({
    type: PasswordEmailVerificationOutputDto,
  })
  async sendPasswordResetEmail(@Body() body: EmailVerificationInputDto) {
    return this.sendRequest(
      ACCOUNT_SERVICE_MESSAGE_PATTERN.SEND_PASSWORD_RESET_EMAIL,
      body,
    );
  }

  @Post('/verify-token')
  @HttpCode(200)
  @Serialize(UserOutputDto)
  @ApiOkResponse({
    description: ACCOUNT_SERVICE_MESSAGE.TOKEN_VERIFIED,
  })
  async verifyToken(@Body() body: VerifyTokenInputDto) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.VERIFY_TOKEN, body);
  }

  @Post('/register')
  @HttpCode(201)
  @ApiCreatedResponse({
    type: CreateUserOutputDto,
  })
  async register(@Body() body: CreateUserInputDto) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.REGISTER, body);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({
    type: LoginOutputDto,
  })
  async login(@Body() body: BasicLoginInputDto) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.LOGIN, body);
  }

  @Patch('/reset-password')
  @ApiOkResponse({
    type: PasswordResetOutputDto,
  })
  async resetPassword(@Body() body: PasswordResetInputDto) {
    return this.sendRequest(
      ACCOUNT_SERVICE_MESSAGE_PATTERN.RESET_PASSWORD,
      body,
    );
  }

  @Get('/refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshTokensOutputDto,
  })
  async refreshTokens(@Request() req) {
    const email = req.user['email'];
    const refreshToken = req.user['refreshToken'];
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.REFRESH_TOKENS, {
      email,
      refreshToken,
    });
  }

  @Get('/logout')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: LogoutOutputDto,
  })
  async logout(@Request() req) {
    const email = req.user['email'];
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.LOGOUT, email);
  }

  @Get('/whoami')
  @UseGuards(AccessTokenGuard)
  @Serialize(UserOutputDto)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserOutputDto,
  })
  whoAmi(@Request() req) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.WHOAMI, req.user);
  }

  @Post('/upload-image')
  @ApiOkResponse({
    type: UploadImageOutputDto,
  })
  async uploadProfilePicture(@Body() body: UploadImageInputDto) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.UPLOAD_IMAGE, body);
  }

  @Post('/remove-image')
  @ApiOkResponse({
    type: RemoveImageOutputDto,
  })
  async removeProfilePicture(@Body() body: RemoveImageInputDto) {
    return this.sendRequest(ACCOUNT_SERVICE_MESSAGE_PATTERN.REMOVE_IMAGE, body);
  }

  sendRequest(msgPattern: ACCOUNT_SERVICE_MESSAGE_PATTERN, payload: any) {
    return this.accountServiceClient
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
