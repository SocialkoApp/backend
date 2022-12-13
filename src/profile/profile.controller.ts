import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserID } from 'src/user/user.decorator';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetProfileDto } from './dto/get-profile.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  getPublicProfile(@UserID() id: string) {
    return this.profileService.getProfileById(id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  getSpecificPublicProfile(@Param() params: GetProfileDto) {
    return this.profileService.getPublicProfile(params.username);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(
    @UserID() id: string,
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
    @UserID() id: string,
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
  deleteProfilePicture(@UserID() id: string) {
    return this.profileService.deleteProfilePicture(id);
  }
}
