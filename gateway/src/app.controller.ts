import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Returns an object containing the application name and api version',
  })
  welcomeMessage(): { message: string } {
    return this.appService.getWelcomeMessage();
  }
}
