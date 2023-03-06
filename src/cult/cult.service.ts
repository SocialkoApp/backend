import { UpdateCultDto } from './dto/update-cult.dto';
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
  Add = 'add',
  Remove = 'remove',
}

export enum RequestAction {
  Accept = 'accept',
  Decline = 'decline',
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

  private cultPrivate: Prisma.CultSelect = {
    ...this.cult,
    members: {
      select: {
        member: {
          select: this.profile,
        },
        role: true,
      },
    },
  };

  private cultRuler: Prisma.CultSelect = {
    ...this.cultPrivate,
    joinRequests: {
      select: {
        profile: {
          select: this.profile,
        },
      },
    },
  };

  async createCult(id: string, { name, description, iconId }: CreateCultDto) {
    const { profileId } = await this.userService.find({ id });

    if (!this.nameRegex.test(name)) {
      return new BadRequestException('Invalid cult name');
    }

    if (this.userInCult(profileId)) {
      return new ConflictException('User already in cult');
    }

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

  async findMyCult(id: string) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    if (!(await this.userInCult(profileId))) {
      return new ForbiddenException("You're not in a cult.");
    }

    try {
      const c = await this.prisma.cult.findUnique({
        where: {
          id: cult['cult'].id,
        },
        select:
          cult.role === CultRole.Ruler ? this.cultRuler : this.cultPrivate,
      });

      return {
        ...c,
        role: cult.role,
      };
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateMyCult(id: string, body: UpdateCultDto) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    if (!(await this.userInCult(profileId))) {
      return new ForbiddenException("You're not in a cult.");
    }

    if (!this.nameRegex.test(body.name)) {
      return new BadRequestException('Invalid cult name');
    }

    try {
      const c = await this.prisma.cult.update({
        where: {
          id: cult['cult'].id,
        },
        data: body,
        select: this.cult,
      });

      return c;
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateMyCultIcon(id: string, fileId: string) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    if (!(await this.userInCult(profileId))) {
      return new ForbiddenException("You're not in a cult.");
    }

    try {
      const c = await this.prisma.cult.update({
        where: { id: cult['cult'].id },
        data: {
          iconId: fileId,
        },
        select: this.cult,
      });

      return c;
    } catch (e) {
      this.handleException(e);
    }
  }

  async find(input: Prisma.CultWhereUniqueInput) {
    try {
      const cult = await this.prisma.cult.findUnique({
        where: input,
        select: this.cult,
      });

      return cult;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findByName(id: string, name: string) {
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

  async joinRequest(id: string, cultId: string) {
    const { profileId } = await this.userService.find({ id });

    if (await this.userInCult(profileId)) {
      return new ConflictException('User already in cult');
    }

    try {
      await this.prisma.cult.update({
        where: {
          id: cultId,
        },
        data: {
          joinRequests: {
            create: {
              profileId,
            },
          },
        },
      });

      const requester = await this.prisma.profile.findUnique({
        where: {
          id: profileId,
        },
        select: {
          ...this.profile,
          cultJoinRequest: {
            select: {
              cultId: true,
            },
          },
        },
      });

      return requester;
    } catch (e) {
      this.handleException(e);
    }
  }

  async manageRequest(id: string, requesterId: string, action: RequestAction) {
    const profile = await this.profileService.getProfileByUserId(id);

    if (!(await this.userInCult(profile.id))) {
      return new ForbiddenException("You're not in a cult.");
    }

    if (profile.cult.role !== CultRole.Ruler) {
      return new ForbiddenException(
        "You're not the ruler, so you can't manage people",
      );
    }

    try {
      const decline = await this.prisma.cult.update({
        where: {
          id: profile.cult['cult'].id,
        },
        data: {
          joinRequests: {
            delete: {
              profileId: requesterId,
            },
          },
        },
        select: {
          joinRequests: {
            select: {
              profile: {
                select: this.profile,
              },
            },
          },
        },
      });

      if (action === RequestAction.Accept) {
        const { user } = await this.profileService.find({ id: requesterId });
        return await this.manageMembership(id, user.username, Action.Add);
      }

      return decline;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findMembers(id: string) {
    const profile = await this.profileService.getProfileByUserId(id);

    if (!(await this.userInCult(profile.id))) {
      return new ForbiddenException("You're not in a cult.");
    }

    try {
      const members = await this.prisma.cult.findUnique({
        where: {
          id: profile.cult['cult'].id,
        },
        select: {
          members: {
            select: {
              member: {
                select: this.profile,
              },
              role: true,
            },
          },
        },
      });

      return members;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findRequests(id: string) {
    const profile = await this.profileService.getProfileByUserId(id);

    if (!(await this.userInCult(profile.id))) {
      return new ForbiddenException("You're not in a cult.");
    }

    if (profile.cult.role !== CultRole.Ruler) {
      return new ForbiddenException(
        "You're not the ruler, so you can't manage people",
      );
    }

    try {
      const requests = await this.prisma.cult.findUnique({
        where: {
          id: profile.cult['cult'].id,
        },
        select: {
          joinRequests: {
            select: {
              profile: {
                select: this.profile,
              },
            },
          },
        },
      });

      return requests;
    } catch (e) {
      this.handleException(e);
    }
  }

  async manageMembership(id: string, username: string, action: Action) {
    // The profile of the user who is adding/removing someone to/from the cult
    const user = await this.userService.find({ id });
    const { cult } = await this.profileService.getProfileByUserId(id);

    // The profile of the user we're adding/removing to the cult
    const addee = await this.userService.find({ username });

    if (cult.role !== CultRole.Ruler) {
      return new ForbiddenException(
        "You're not the ruler, so you can't manage people",
      );
    }

    try {
      const add = await this.prisma.cult.update({
        where: {
          id: cult['cult'].id,
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

      if (action === Action.Remove) {
        await this.prisma.post.deleteMany({
          where: {
            authorId: addee.profileId,
          },
        });
      }

      this.logger.verbose(
        `${user.username} has ${action}ed ${username} ${
          action === Action.Add ? 'to' : 'from'
        } ${add.name}`,
      );

      return add;
    } catch (e) {
      this.handleException(e);
    }
  }

  async userInCult(id: string) {
    try {
      const profile = await this.profileService.find({ id });

      if (!profile.cult) return false;

      if (profile.cult !== null) return true;
    } catch (e) {
      this.handleException(e);
    }

    return false;
  }

  async checkMembership(id: string, cultId: string) {
    try {
      const profile = await this.profileService.find({ id });

      if (!profile.cult) {
        return false;
      }

      if (profile.cult.cultId === cultId) {
        return true;
      }
    } catch (e) {
      this.handleException(e);
    }

    return false;
  }

  private nameRegex: RegExp = /^[A-Za-z0-9_.-]{4,16}$/;

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(`There was a conflicting field`);
        default:
          this.logger.error(error);
          throw new BadRequestException(error.code);
      }
    } else {
      this.logger.error(error);
      throw new BadRequestException(error.name);
    }
  }
}
