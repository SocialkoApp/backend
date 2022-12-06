import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ProfileModule } from './profile/profile.module';
import { FilesModule } from './files/files.module';
import { RoleModule } from './role/role.module';
import { PostModule } from './post/post.module';
import { CultController } from './cult/cult.controller';
import { CultService } from './cult/cult.service';
import { CultModule } from './cult/cult.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    EmailConfirmationModule,
    MailModule,
    ForgotPasswordModule,
    ProfileModule,
    FilesModule,
    RoleModule,
    PostModule,
    CultModule,
  ],
  controllers: [CultController],
  providers: [CultService],
})
export class AppModule {}
