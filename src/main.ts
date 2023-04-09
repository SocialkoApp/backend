import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE') ?? 'Socialko API')
    .setContact(
      configService.get('SWAGGER_CONTACT_NAME') ?? 'Aiken Tine Ahac',
      configService.get('SWAGGER_CONTACT_WEBSITE') ?? 'https://aikenahac.com',
      configService.get('SWAGGER_CONTACT_EMAIL') ?? 'ahac.aiken@gmail.com',
    )
    .setDescription(
      configService.get('SWAGGER_DESCRIPTION') ?? 'Socialko API Documentation',
    )
    .setVersion(configService.get('SWAGGER_API_VERSION') ?? '0.0.1')
    .addTag(configService.get('SWAGGER_TAG') ?? 'socialko')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('', app, document, {
    customSiteTitle: 'Socialko API',
  });

  config.update({
    accessKeyId: configService.get('S3_ACCESS_KEY'),
    secretAccessKey: configService.get('S3_SECRET_KEY'),
    region: configService.get('S3_REGION'),
  });

  await app.listen(4000);
}
bootstrap();
