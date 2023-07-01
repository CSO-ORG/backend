import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage(): { message: string } {
    return {
      message: 'CSO API v' + process.env.APP_VERSION,
    };
  }
}
