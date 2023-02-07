import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UpdatePublicUserDto } from './dto/update-public-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  private readonly logger: Logger = new Logger(UserService.name);

  async findPublic(select: Prisma.UserWhereUniqueInput) {
    await this.check(select);
    const user = await this.prisma.user.findUnique({
      where: select,
      select: {
        username: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            bio: true,
            profilePicture: {
              select: {
                url: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  async updatePublic(id: string, updateUserDto: UpdatePublicUserDto) {
    let hashedPassword;
    if (updateUserDto.password) {
      hashedPassword = await this.hashPassword(
        updateUserDto.password.toString(),
      );
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          password: hashedPassword,
        },
      });

      return user;
    } catch (e) {
      this.handleException(e);
    }
  }

  async createPublic({
    username,
    email,
    password,
    firstName,
    lastName,
  }: RegisterDto) {
    const hashedPassword = await this.hashPassword(password);

    this.validateUsername(username);
    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          profile: {
            create: {
              firstName: firstName,
              lastName: lastName,
            },
          },
        },
      });

      this.logger.verbose(
        `${firstName} ${lastName} has registered with username ${username}`,
      );

      this.emailConfirmationService.sendConfirmationEmail(user.email);

      this.logger.verbose(user);

      return user;
    } catch (e) {
      this.handleException(e);
    }
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: usernameOrEmail,
              mode: 'insensitive',
            },
          },
          {
            email: {
              equals: usernameOrEmail,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return user;
  }

  async find(user: Prisma.UserWhereUniqueInput) {
    await this.check(user);
    const { password, ...result } = await this.prisma.user.findUnique({
      where: user,
      include: {
        profile: {
          include: {
            profilePicture: true,
          },
        },
      },
    });
    return result;
  }

  async update(
    user: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto,
  ) {
    await this.check(user);
    let hashedPassword;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }
    const { password, ...result } = await this.prisma.user.update({
      where: user,
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
    return result;
  }

  async delete(id: string) {
    await this.check({ id });
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async check(user: Prisma.UserWhereUniqueInput) {
    if (!(await this.prisma.user.findUnique({ where: user }))) {
      throw new NotFoundException('This user does not exist');
    }
  }

  validateUsername(username: string) {
    const regex: RegExp = /^[a-z0-9_.-]{4,16}$/;

    if (!regex.test(username)) {
      return new BadRequestException('Invalid username');
    }
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, await bcrypt.genSalt());
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
