import { ACCOUNT_SERVICE_MESSAGE_PATTERN } from '@cso-org/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { handleError } from 'src/handlers/error.handler';
import { CloudinaryService } from './cloudinary.service';
import { RemoveImageInputDto } from './dtos/input/RemoveImageInputDto';
import { UploadImageInputDto } from './dtos/input/UploadImageInputDto';

@Controller()
export class CloudinaryController {
  constructor(private cloudinaryService: CloudinaryService) {}

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.UPLOAD_IMAGE,
  })
  async uploadImage(
    @Payload() data: UploadImageInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.cloudinaryService
      .upload(data.image)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }

  @MessagePattern({
    cmd: ACCOUNT_SERVICE_MESSAGE_PATTERN.REMOVE_IMAGE,
  })
  async removeImage(
    @Payload() data: RemoveImageInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
    return this.cloudinaryService
      .remove(data.public_id)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
