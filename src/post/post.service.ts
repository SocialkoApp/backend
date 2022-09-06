import {
  BadRequestException,
  ConflictException,
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

  private public: Prisma.PostSelect = {
    id: true,
    upvotes: {
      select: {
        profile: {
          select: this.profile,
        },
      },
    },
    downvotes: {
      select: {
        profile: {
          select: this.profile,
        },
      },
    },
    description: true,
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
  async getPosts(id: number) {
    const { profileId } = await this.userService.find({ id });

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          authorId: { not: profileId },
        },
        select: this.public,
      });

      return posts;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getUserPosts(username: string) {
    try {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            user: {
              username: username,
            },
          },
        },
        select: this.public,
      });

      return posts;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getMyPosts(id: number) {
    const { profileId } = await this.userService.find({ id });

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            id: profileId,
          },
        },
        select: this.public,
      });

      return posts;
    } catch (e) {
      this.handleException(e);
    }
  }

  async upvotePost(id: number, postIdd: string) {
    const { profileId } = await this.userService.find({ id });

    const postId: number = parseInt(postIdd);

    this.check(postId);

    const upvoted: boolean = await this.checkUpvoted(id, postIdd);
    const downvoted: boolean = await this.checkDownvoted(id, postIdd);

    if (downvoted) {
      await this.downvotePost(id, postIdd);
    }

    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: upvoted
          ? {
              upvotes: {
                delete: {
                  profileId_postId: { profileId, postId },
                },
              },
            }
          : {
              upvotes: {
                create: {
                  profileId,
                },
              },
            },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  async downvotePost(id: number, postIdd: string) {
    const { profileId } = await this.userService.find({ id });

    const postId: number = parseInt(postIdd);

    this.check(postId);

    const downvoted: boolean = await this.checkDownvoted(id, postIdd);
    const upvoted: boolean = await this.checkUpvoted(id, postIdd);

    if (upvoted) {
      await this.upvotePost(id, postIdd);
    }

    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: downvoted
          ? {
              downvotes: {
                delete: {
                  profileId_postId: { profileId, postId },
                },
              },
            }
          : {
              downvotes: {
                create: {
                  profileId,
                },
              },
            },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  async checkUpvoted(id: number, postIdd: string) {
    const { profileId } = await this.userService.find({ id });

    const postId: number = parseInt(postIdd);

    if (
      await this.prisma.post.findFirst({
        where: {
          id: postId,
          upvotes: {
            some: {
              profileId: profileId,
            },
          },
        },
      })
    ) {
      return true;
    }

    return false;
  }

  async checkDownvoted(id: number, postIdd: string) {
    const { profileId } = await this.userService.find({ id });

    const postId: number = parseInt(postIdd);

    if (
      await this.prisma.post.findFirst({
        where: {
          id: postId,
          downvotes: {
            some: {
              profileId: profileId,
            },
          },
        },
      })
    ) {
      return true;
    }

    return false;
  }

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
