import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/create.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
    private readonly userService: UserService,
  ) {}

  private readonly logger: Logger = new Logger(PostService.name);

  private public: Prisma.PostSelect = {
    id: true,
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

  async createPost(id: number, { description, imageId }: CreatePostDto) {
    const { profileId } = await this.userService.find({ id });
    try {
      const post = await this.prisma.post.create({
        data: {
          description,
          imageId,
          authorId: profileId,
        },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getPost(id: string) {
    const postId = parseInt(id);
    this.check(postId);
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  // Get all posts that weren't posted by you
  async getAllPosts() {}

  async check(id: number) {
    if (!(await this.prisma.post.findUnique({ where: { id } }))) {
      throw new NotFoundException('This post does not exist');
    }
  }

  private handleException(error: Error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(error);
      throw new BadRequestException(error.code);
    }
  }
}
