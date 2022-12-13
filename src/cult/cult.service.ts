import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CultRole, Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { UserService } from 'src/user/user.service';
import { CreateCultDto } from './dto/create.dto';

@Injectable()
export class CultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  private readonly logger: Logger = new Logger(CultService.name);

  private profile: Prisma.ProfileSelect = {
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

  private cultPrivate: Prisma.CultSelect = {
    id: true,
    name: true,
    description: true,
    members: {
      select: {
        member: {
          select: this.profile,
        },
      },
    },
  };

  private cult: Prisma.CultSelect = {
    id: true,
    name: true,
    description: true,
    icon: {
      select: {
        url: true,
      },
    },
  };

  async createCult(id: string, { name, description, iconId }: CreateCultDto) {
    const { profileId } = await this.userService.find({ id });

    this.validateCultName(name);

    try {
      const cult = await this.prisma.cult.create({
        data: {
          name,
          description,
          iconId,
          members: {
            create: {
              memberId: profileId,
              role: CultRole.Ruler,
            },
          },
        },
      });

      this.logger.verbose(`The cult ${name} has been created`);

      this.logger.verbose(cult);

      return cult;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findAll() {
    try {
      const cults = await this.prisma.cult.findMany({
        select: this.cult,
      });

      return cults;
    } catch (e) {
      this.handleException(e);
    }
  }

  async find(id: string, name: string) {
    const { profileId } = await this.userService.find({ id });

    try {
      let cult = await this.prisma.cult.findUnique({
        where: {
          name,
        },
        select: this.cultPrivate,
      });

      if (this.isMember(profileId, cult.id)) {
        cult = await this.prisma.cult.findUnique({
          where: {
            name,
          },
          select: this.cult,
        });
      }

      return cult;
    } catch (e) {
      this.handleException(e);
    }
  }

  async isMember(id: string, cultId: string) {
    const profile = await this.profileService.getProfileById(id);

    if (profile.cult.cultId === cultId) {
      return true;
    }

    return false;
  }

  private validateCultName(name: string) {
    const regex: RegExp = /^[A-Za-z0-9_.-]{4,16}$/;

    if (!regex.test(name)) {
      return new BadRequestException('Invalid cult name');
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          const conflictingField = error.meta['target'][0];
          throw new ConflictException(
            `User with this ${conflictingField} already exists`,
          );
        default:
          this.logger.error(error);
          throw new BadRequestException(error.code);
      }
    }
  }
}
