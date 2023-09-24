import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT) ?? 8080;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  // app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.APP_VERSION,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CSO API')
    .setDescription('Endpoints for CSO platform')
    .setVersion(process.env.APP_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
