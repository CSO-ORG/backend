import { CustomError } from '@cso-org/shared';
import { RpcException } from '@nestjs/microservices';

export const handleError = (err: Error) => {
  if (err instanceof CustomError) {
    throw new RpcException(err.serializeError());
  }

  throw new RpcException({ statusCode: 500, message: err.message });
};
