import { ALERT_SERVICE_MESSAGE_PATTERN, IUser } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { handleError } from 'src/handlers/error.handler';
import { FavoriteService } from './favorite.service';

@Controller()
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}
  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.ADD_FAVORITE,
  })
  async createFavorite(
    @Payload() input: { id: string; user: IUser },
    @Ctx() context: RmqContext,
  ) {
    console.log('====> INSIDE: ', input);
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.favoriteService
      .createFavorite(input.id, input.user)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.GET_FAVORITES,
  })
  async getMyFavorites(
    @Payload() input: { user: IUser },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.favoriteService
      .getMyFavorites(input.user)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ALERT_SERVICE_MESSAGE_PATTERN.DELETE_FAVORITE,
  })
  async deleteFavorite(
    @Payload() input: { id: string; user: IUser },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.favoriteService
      .deleteFavorite(input.id, input.user)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
