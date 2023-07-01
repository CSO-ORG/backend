import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const handleError = (err) => {
  console.log(`[gateway error handler]: `, err);
  switch (err.statusCode) {
    case 400:
      throw new BadRequestException(err.message);
    case 404:
      throw new NotFoundException(err.message);
    case 403:
      throw new ForbiddenException(err.message);
    case 401:
      throw new UnauthorizedException(err.message);
    default:
      console.log(err);
      throw new InternalServerErrorException(err.message);
  }
};
