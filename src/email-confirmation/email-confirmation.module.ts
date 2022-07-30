import { forwardRef, Module } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('EMAIL_CONFIRM_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
