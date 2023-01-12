import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CultRole, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { UserService } from 'src/user/user.service';
import { CreateCultDto } from './dto/create.dto';

export enum Action {
  Remove = 'remove',
  Add = 'Add',
}

@Injectable()
export class CultService {
  constructor(
    private readonly prisma: PrismaService,
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
        role: true,
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
    _count: {
      select: {
        members: true,
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
        select: this.cult,
      });

      const isMember = await this.checkMembership(profileId, cult.id);

      if (isMember) {
        cult = await this.prisma.cult.findUnique({
          where: {
            name,
          },
          select: this.cultPrivate,
        });
      }

      return cult;
    } catch (e) {
      this.handleException(e);
    }
  }

  async manageMembership(id: string, username: string, action: Action) {
    // The profile of the user who is adding someone to the cult
    const { cult } = await this.profileService.getProfileByUserId(id);

    // The profile of the user we're adding to the cult
    const addee = await this.userService.find({ username });

    if (cult.role !== CultRole.Ruler) {
      return new ForbiddenException(
        "You're not the ruler, so you can't manage people",
      );
    }

    try {
      const add = await this.prisma.cult.update({
        where: {
          id: cult.cultId,
        },
        data: {
          members:
            action === Action.Add
              ? {
                  create: {
                    memberId: addee.profileId,
                  },
                }
              : {
                  delete: {
                    memberId: addee.profileId,
                  },
                },
        },
        select: this.cultPrivate,
      });

      return add;
    } catch (e) {
      this.handleException(e);
    }
  }

  async checkMembership(id: string, cultId: string) {
    try {
      const { cult } = await this.profileService.find({ id });

      if (cult.cultId === cultId) {
        return true;
      }
    } catch (e) {
      this.handleException(e);
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
          throw new ConflictException(`There was a conflicting field`);
        default:
          this.logger.error(error);
          throw new BadRequestException(error.code);
      }
    }
  }
}
