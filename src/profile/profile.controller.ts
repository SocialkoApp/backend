import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserID } from 'src/user/user.decorator';
import { ProfileService } from './profile.service';
import { GetProfileDto } from './dto/get-profile.dto';
import { Role } from '@prisma/client';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  getPublicProfile(@UserID() id: string) {
    return this.profileService.getProfileByUserId(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  getSpecificPublicProfile(@Param() params: GetProfileDto) {
    return this.profileService.getPublicProfile(params.username);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put()
  updateProfile(
    @UserID() id: string,
    @Body() profileUpdateDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(id, profileUpdateDto);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('profile-picture')
  updateProfilePicture(
    @UserID() id: string,
    @Body() body: UpdateProfilePictureDto,
  ) {
    return this.profileService.updateProfilePicture(id, body.fileId);
  }
}
