import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  private readonly logger: Logger = new Logger(ProfileService.name);

  private cult: Prisma.CultSelect = {
    id: true,
    name: true,
    description: true,
    icon: {
      select: {
        url: true,
      },
    },
    _count: {
      select: {
        members: true,
      },
    },
  };

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
    cult: {
      select: {
        cult: {
          select: this.cult,
        },
        role: true,
      },
    },
    cultJoinRequest: {
      select: {
        cult: {
          select: this.cult,
        },
      },
    },
    updatedAt: true,
  };

  async find(input: Prisma.ProfileWhereUniqueInput) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: input,
        select: this.public,
      });

      return profile;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getProfileByUserId(id: string) {
    const { profileId } = await this.userService.find({ id });

    return this.find({ id: profileId });
  }

  async getPublicProfile(username: string) {
    const { profileId } = await this.userService.find({ username });

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

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
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

  async updateProfilePicture(id: string, fileId: string) {
    const { profileId } = await this.userService.find({ id });

    try {
      const profile = await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          profilePictureId: fileId,
        },
        select: this.public,
      });

      return profile;
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
