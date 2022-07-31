import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('Forgot Password')
@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  @Public()
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.forgotPasswordService.forgotPassword(email);
  }

  @Put()
  @Public()
  async resetPassword(@Body() { code, password }: ResetPasswordDto) {
    return await this.forgotPasswordService.resetPassword(code, password);
  }
}
