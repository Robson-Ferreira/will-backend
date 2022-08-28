import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { hostname } from 'os';
import { Env } from './commons/environment';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { DefaultExceptionFilter } from './commons/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new DefaultExceptionFilter());

  const swaggerDocumentBuilder = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(Env.SWAGGER_TITLE)
    .setDescription(Env.SWAGGER_DESCRIPTION)
    .setVersion(Env.APPLICATION_VERSION)
    .addServer(Env.SWAGGER_SERVER)
    .setContact(
      'Will Bank',
      'https://www.willbank.com.br',
      'arquiteturasolucao@willbank.com.br',
    )
    .addBearerAuth()
    .build();

  const swaggerDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerDocumentBuilder,
    swaggerDocumentOptions,
  );

  SwaggerModule.setup(Env.SWAGGER_DOCS, app, swaggerDocument);

  await app
    .listen(+Env.APP_PORT)
    .then(() =>
      Logger.log(`API Listen on ${Env.NODE_ENV}@${hostname()}:${Env.APP_PORT}`),
    )
    .catch((error) => Logger.error(error));
}
bootstrap();
