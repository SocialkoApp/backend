import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { SessionInterceptor } from './auth/interceptors/session.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new SessionInterceptor(app.get<AuthService>(AuthService)),
  );

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
