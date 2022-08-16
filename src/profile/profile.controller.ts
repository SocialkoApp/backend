import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserId } from 'src/user/user.decorator';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  getPublicProfile(@UserId() id: number) {
    return this.profileService.getPublicProfile(id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(
    @UserId() id: number,
    @Body() profileUpdateDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, profileUpdateDto);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('profile-picture')
  updateProfilePicture(
    @UserId() id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.updateProfilePicture(
      id,
      file.buffer,
      file.originalname,
    );
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Delete('profile-picture')
  deleteProfilePicture(@UserId() id: number) {
    return this.profileService.deleteProfilePicture(id);
  }
}
