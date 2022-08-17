import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { CreatePostDto } from './dto/create.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger: Logger = new Logger(PostService.name);

  private public: Prisma.PostSelect = {
    upvotes: true,
    downvotes: true,
    author: {
      select: {
        id: true,
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
      },
    },
    image: {
      select: {
        url: true,
      },
    },
    createdAt: true,
  };

  async uploadPostImage(buffer: Buffer, filename: string) {
    try {
      const file = await this.filesService.uploadPublicFile(buffer, filename);

      return file;
    } catch (e) {
      this.handleException(e);
    }
  }

  async createPost({ description, imageId, authorId }: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          description,
          imageId,
          authorId,
        },
      });

      return post;
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
