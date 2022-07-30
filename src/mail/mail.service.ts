import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmMail(email: string, token: string, late: boolean = false) {
    const url = this.configService.get('MAIL_CONFIRM_URL');
    if (!url) {
      throw new Error('There was an error sending the confirmation email');
    }
    const user = await this.userService.find({ email });
    return this.mailerService.sendMail({
      to: user.email,
      subject: late
        ? 'New email address confirmation'
        : 'Email address confirmation',
      template: late ? './email-late' : './email',
      context: {
        name: user.profile.firstName,
        url: `${url}/${token}`,
      },
    });
  }

  async sendForgotPasswordMail(email: string, token: string) {
    const url = this.configService.get('MAIL_FORGOT_PASSWORD_URL');
    if (!url) {
      throw new Error('There was an error sending the forgot password email');
    }
    const user = await this.userService.find({ email });
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Ponastavitev gesla',
      template: './password',
      context: {
        name: user.profile.firstName,
        url: `${url}/${token}`,
      },
    });
  }
}
