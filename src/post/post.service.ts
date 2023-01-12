import { ProfileService } from 'src/profile/profile.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/create.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
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

  async createPost(id: string, { description, imageId }: CreatePostDto) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    try {
      const post = await this.prisma.post.create({
        data: {
          description,
          imageId,
          authorId: profileId,
          cultId: cult.cultId,
        },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getPost(id: string) {
    this.check(id);
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  // Get all posts that weren't posted by you
  async getPosts(id: string) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          authorId: { not: profileId },
          cultId: cult.cultId,
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

  async getMyPosts(id: string) {
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

  async upvotePost(id: string, postId: string) {
    const { profileId } = await this.userService.find({ id });

    this.check(postId);

    const upvoted: boolean = await this.checkUpvoted(id, postId);
    const downvoted: boolean = await this.checkDownvoted(id, postId);

    if (downvoted) {
      await this.downvotePost(id, postId);
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

  async downvotePost(id: string, postId: string) {
    const { profileId } = await this.userService.find({ id });

    this.check(postId);

    const downvoted: boolean = await this.checkDownvoted(id, postId);
    const upvoted: boolean = await this.checkUpvoted(id, postId);

    if (upvoted) {
      await this.upvotePost(id, postId);
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

  async checkUpvoted(id: string, postId: string) {
    const { profileId } = await this.userService.find({ id });

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

  async checkDownvoted(id: string, postId: string) {
    const { profileId } = await this.userService.find({ id });

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

  private async check(id: string) {
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
