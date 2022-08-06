import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger: Logger = new Logger(ProfileService.name);

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    try {
      const profile = await this.prisma.profile.update({
        where: { id },
        data: updateProfileDto,
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
