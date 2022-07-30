import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailVerificationPayload } from './interfaces/email-verification-payload.interface';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  private logger = new Logger(EmailConfirmationService.name);

  async sendConfirmationEmail(emailOrUsername: string) {
    const { emailConfirmationSentAt, email } =
      await this.userService.findByUsernameOrEmail(emailOrUsername);
    this.logger.verbose(`Sending confirmation email to ${email}`);
    const payload: EmailVerificationPayload = { email };
    const token = this.jwtService.sign(payload);
    try {
      await this.mailService.sendConfirmMail(
        email,
        token,
        !emailConfirmationSentAt,
      );
      await this.userService.update(
        { email },
        { emailConfirmationSentAt: new Date() },
      );
      this.logger.verbose(`Confirmation email sent to ${email}`);
    } catch (e) {
      this.logger.error(e);
      throw new Error('There was an error sending the confirmation email');
    }
  }

  async confirmEmail({ token }: ConfirmEmailDto) {
    const email = this.decodeConfirmationToken(token);
    this.logger.verbose(`Confirming email ${email}`);
    const user = await this.userService.find({ email });
    if (user.emailConfirmed) {
      this.logger.verbose(`Email ${email} already confirmed`);
      throw new BadRequestException('Email already confirmed');
    }
    await this.userService.update({ email }, { emailConfirmed: true });
    this.logger.verbose(`Email ${email} confirmed`);
  }

  decodeConfirmationToken(token: string) {
    try {
      const payload: EmailVerificationPayload = this.jwtService.verify(token);

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
