import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Socialko')
    .setContact(
      'Aiken Tine Ahac',
      'https://aikenahac.com',
      'ahac.aiken@gmail.com',
    )
    .setDescription('The Socialko API description')
    .setVersion('0.0.1')
    .addTag('socialko')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Socialko API',
  });

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY'),
    secretAccessKey: configService.get('S3_SECRET_KEY'),
    region: configService.get('S3_REGION'),
  });

  await app.listen(4000);
}
bootstrap();
