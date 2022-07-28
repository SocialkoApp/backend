import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  // UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import {
  AuthService,
  // RegistrationSeederStatus,
  RegistrationStatus,
} from './auth.service';
import {
  CreateUserDto,
  LoginUserDto,
  // RenderSeederUser,
  // SeedUserDto,
} from '../user/dto/user.dto';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return await this.authService.login(loginUserDto);
  }
}
