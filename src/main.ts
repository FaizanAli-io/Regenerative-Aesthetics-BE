import {
  NestFactory,
  Reflector,
} from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'PROD'
        ? process.env.FE_URL
        : true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
    credentials: true,
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(
      app.get(Reflector),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  app.setGlobalPrefix('api/v1');

  if (process.env.NODE_ENV !== 'PROD') {
    const config = new DocumentBuilder()
      .setTitle('Regenerative Aesthetics API')
      .setDescription(
        'Regenerative Aesthetics API Description',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(
      app,
      config,
    );
    SwaggerModule.setup('api/v1', app, document);
  }

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
