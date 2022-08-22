import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger: Logger = new Logger(ProfileService.name);

  private public: Prisma.ProfileSelect = {
    id: true,
    firstName: true,
    lastName: true,
    bio: true,
    user: {
      select: {
        username: true,
      },
    },
    profilePicture: {
      select: {
        url: true,
      },
    },
    updatedAt: true,
  };

  async getPublicProfile(id: number) {
    const { profileId } = await this.userService.find({ id });

    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: profileId },
        select: this.public,
      });

      return profile;
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    const { profileId } = await this.userService.find({ id });

    try {
      const profile = await this.prisma.profile.update({
        where: { id: profileId },
        data: updateProfileDto,
        select: this.public,
      });

      return profile;
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateProfilePicture(id: number, buffer: Buffer, filename: string) {
    const { profileId } = await this.userService.find({ id });
    const file = await this.filesService.uploadPublicFile(buffer, filename);

    try {
      const profile = await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          profilePictureId: file.id,
        },
        select: this.public,
      });

      return profile;
    } catch (e) {
      this.handleException(e);
    }
  }

  async deleteProfilePicture(id: number) {
    const { profileId } = await this.userService.find({ id });

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile.profilePictureId) {
      throw new NotFoundException('No profile picture found');
    }

    try {
      const update = await this.prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          profilePictureId: undefined,
        },
        select: this.public,
      });

      this.filesService.deletePublicFile(profile.profilePictureId);

      return update;
    } catch (e) {
      this.handleException(e);
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(error);
      throw new BadRequestException(error.code);
    }
  }
}
