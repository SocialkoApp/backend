import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Socialko API',
  });

  await app.listen(3000);
}
bootstrap();
