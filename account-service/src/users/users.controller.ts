import { ACCOUNT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { handleError } from 'src/handlers/error.handler';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.FIND_USER_BY_EMAIL,
  })
  async findUserByEmail(@Payload() email: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.usersService
      .find(email)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
