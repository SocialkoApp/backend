import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateCultDto } from './dto/create.dto';

@Injectable()
export class CultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly userService: UserService,
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

  async createCult({ name, description, iconId }: CreateCultDto) {
    this.validateCultName(name);

    try {
      const cult = await this.prisma.cult.create({
        data: {
          name,
          description,
          iconId,
        },
      });

      this.logger.verbose(`The cult ${name} has been created`);

      this.logger.verbose(cult);
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
