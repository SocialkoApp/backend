import { UpdateOrganizationDto } from './dto/update-org.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { OrganizationRole, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { UserService } from 'src/user/user.service';
import { CreateOrganizationDto } from './dto/create.dto';

export enum Action {
  Add = 'add',
  Remove = 'remove',
}

export enum RequestAction {
  Accept = 'accept',
  Decline = 'decline',
}

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  private readonly logger: Logger = new Logger(OrganizationService.name);

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

  private org: Prisma.OrganizationSelect = {
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

  private orgPrivate: Prisma.OrganizationSelect = {
    ...this.org,
    members: {
      select: {
        member: {
          select: this.profile,
        },
        role: true,
      },
    },
  };

  private orgAdmin: Prisma.OrganizationSelect = {
    ...this.orgPrivate,
    joinRequests: {
      select: {
        profile: {
          select: this.profile,
        },
      },
    },
  };

  async createOrg(
    id: string,
    { name, description, iconId }: CreateOrganizationDto,
  ) {
    const { profileId } = await this.userService.find({ id });

    if (!this.nameRegex.test(name)) {
      throw new BadRequestException('Invalid organization name');
    }

    if (await this.userInOrg(profileId)) {
      throw new ConflictException('You are already in an organization');
    }

    if (await this.userHasRequest(profileId)) {
      throw new ConflictException('You currently have a pending join request');
    }

    this.logger.verbose('Attempting to create organization');

    try {
      const organization = await this.prisma.organization.create({
        data: {
          name,
          description,
          iconId,
          members: {
            create: {
              memberId: profileId,
              role: OrganizationRole.Admin,
            },
          },
        },
      });

      this.logger.verbose(`The organization ${name} has been created`);

      return organization;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findAll() {
    try {
      const orgs = await this.prisma.organization.findMany({
        select: this.org,
      });

      return orgs;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findMyOrganization(id: string) {
    const { profileId } = await this.userService.find({ id });
    const { organization } = await this.profileService.find({ id: profileId });

    if (!(await this.userInOrg(profileId))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    try {
      const c = await this.prisma.organization.findUnique({
        where: {
          id: organization['organization'].id,
        },
        select:
          organization.role === OrganizationRole.Admin
            ? this.orgAdmin
            : this.orgPrivate,
      });

      return {
        ...c,
        role: organization.role,
      };
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateMyOrganization(id: string, body: UpdateOrganizationDto) {
    const { profileId } = await this.userService.find({ id });
    const { organization } = await this.profileService.find({ id: profileId });

    if (!(await this.userInOrg(profileId))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    if (!this.nameRegex.test(body.name)) {
      throw new BadRequestException('Invalid organization name');
    }

    try {
      const org = await this.prisma.organization.update({
        where: {
          id: organization['organization'].id,
        },
        data: body,
        select: this.org,
      });

      return org;
    } catch (e) {
      this.handleException(e);
    }
  }

  async updateMyOrganizationIcon(id: string, fileId: string) {
    const { profileId } = await this.userService.find({ id });
    const { organization } = await this.profileService.find({ id: profileId });

    if (!(await this.userInOrg(profileId))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    try {
      const org = await this.prisma.organization.update({
        where: { id: organization['organization'].id },
        data: {
          iconId: fileId,
        },
        select: this.org,
      });

      return org;
    } catch (e) {
      this.handleException(e);
    }
  }

  async find(input: Prisma.OrganizationWhereUniqueInput) {
    try {
      const org = await this.prisma.organization.findUnique({
        where: input,
        select: this.org,
      });

      return org;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findByName(id: string, name: string) {
    const { profileId } = await this.userService.find({ id });

    try {
      let org = await this.prisma.organization.findUnique({
        where: {
          name,
        },
        select: this.org,
      });

      const isMember = await this.checkMembership(profileId, org.id);

      if (isMember) {
        org = await this.prisma.organization.findUnique({
          where: {
            name,
          },
          select: this.orgPrivate,
        });
      }

      return org;
    } catch (e) {
      this.handleException(e);
    }
  }

  async joinRequest(id: string, organizationId: string) {
    const { profileId } = await this.userService.find({ id });

    if (await this.userInOrg(profileId)) {
      throw new ConflictException('You are already in an organization');
    }

    if (await this.userHasRequest(profileId)) {
      throw new ConflictException(
        'You already requested to join an organization',
      );
    }

    try {
      await this.prisma.organization.update({
        where: {
          id: organizationId,
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
          organizationJoinRequest: {
            select: {
              organizationId: true,
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

    if (!(await this.userInOrg(profile.id))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    if (profile.organization.role !== OrganizationRole.Admin) {
      throw new ForbiddenException(
        "You're not the Admin, so you can't manage people",
      );
    }

    try {
      const decline = await this.prisma.organization.update({
        where: {
          id: profile.organization['organization'].id,
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

    if (!(await this.userInOrg(profile.id))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    try {
      const members = await this.prisma.organization.findUnique({
        where: {
          id: profile.organization['organization'].id,
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

    if (!(await this.userInOrg(profile.id))) {
      throw new ForbiddenException("You're not in an organization.");
    }

    if (profile.organization.role !== OrganizationRole.Admin) {
      throw new ForbiddenException(
        "You're not the Admin, so you can't manage people",
      );
    }

    try {
      const requests = await this.prisma.organization.findUnique({
        where: {
          id: profile.organization['organization'].id,
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
    // The profile of the user who is adding/removing someone to/from the organization
    const user = await this.userService.find({ id });
    const { organization } = await this.profileService.getProfileByUserId(id);

    // The profile of the user we're adding/removing to the organization
    const addee = await this.userService.find({ username });

    if (organization.role !== OrganizationRole.Admin) {
      throw new ForbiddenException(
        "You're not the Admin, so you can't manage people",
      );
    }

    try {
      const add = await this.prisma.organization.update({
        where: {
          id: organization['organization'].id,
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
        select: this.orgPrivate,
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

  async userInOrg(id: string) {
    try {
      const profile = await this.profileService.find({ id });

      if (!profile.organization) return false;

      if (profile.organization !== null) return true;
    } catch (e) {
      this.handleException(e);
    }

    return false;
  }

  async userHasRequest(id: string) {
    try {
      const profile = await this.profileService.find({ id });

      if (!profile.organizationJoinRequest) return false;

      if (profile.organizationJoinRequest !== null) return true;
    } catch (e) {
      this.handleException(e);
    }

    return false;
  }

  async checkMembership(id: string, organizationId: string) {
    try {
      const profile = await this.profileService.find({ id });

      if (!profile.organization) {
        return false;
      }

      if (profile.organization.organizationId === organizationId) {
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
