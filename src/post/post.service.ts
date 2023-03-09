import { ProfileService } from 'src/profile/profile.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CultRole, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/create.dto';
import { IoTSecureTunneling } from 'aws-sdk';
import { CommentPostDto } from './dto/comment.dto';

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
    cult: {
      select: {
        role: true,
      },
    },
    updatedAt: true,
  };

  private public: Prisma.PostSelect = {
    id: true,
    votes: {
      select: {
        profile: {
          select: this.profile,
        },
        type: true,
      },
    },
    comments: {
      select: {
        author: {
          select: this.profile,
        },
        content: true,
      },
    },
    title: true,
    description: true,
    author: {
      select: this.profile,
    },
    image: {
      select: {
        url: true,
      },
    },
    score: true,
    type: true,
    createdAt: true,
  };

  async createPost(
    id: string,
    { title, description, imageId, type }: CreatePostDto,
  ) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    try {
      const post = await this.prisma.post.create({
        data: {
          title,
          description,
          imageId,
          authorId: profileId,
          cultId: cult.cultId,
          type: type,
        },
        select: this.public,
      });

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getPost(id: string, postId: string) {
    this.check(postId);

    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: this.public,
      });

      if (post.cultId !== cult.cultId) {
        throw new ForbiddenException("This post isn't from your cult.");
      }

      return post;
    } catch (e) {
      this.handleException(e);
    }
  }

  // Get all posts from the cult
  async getPosts(id: string) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    try {
      const posts = await this.prisma.post.findMany({
        where: {
          cultId: cult['cult'].id,
        },
        select: this.public,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return posts;
    } catch (e) {
      this.handleException(e);
    }
  }

  async getUserPosts(id: string, username: string) {
    // User details
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    // Target details
    const target = await this.userService.find({ username });
    const targetProfile = await this.profileService.find({
      id: target.profileId,
    });

    if (
      !cult ||
      !targetProfile.cult ||
      cult.cultId !== targetProfile.cult.cultId
    ) {
      throw new ForbiddenException(
        "You're not in the same cult as this user so you can't view their posts.",
      );
    }

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

  async commentPost(id: string, { postId, content }: CommentPostDto) {
    const { profileId } = await this.userService.find({ id });

    this.check(postId);

    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          comments: {
            create: {
              content,
              authorId: profileId,
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

  async upvotePost(id: string, postId: string) {
    const { profileId } = await this.userService.find({ id });
    const { cult } = await this.profileService.find({ id: profileId });

    this.check(postId);

    const upvoted: boolean = await this.checkUpvoted(id, postId);
    const downvoted: boolean = await this.checkDownvoted(id, postId);

    let pointValue: number = 1;

    if (downvoted) {
      await this.downvotePost(id, postId);
    }

    if (cult.role === CultRole.Ruler) pointValue = 2;

    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: upvoted
          ? {
              votes: {
                delete: {
                  profileId_postId: { profileId, postId },
                },
              },
              score: {
                decrement: pointValue,
              },
            }
          : {
              votes: {
                create: {
                  profileId,
                  type: 'Upvote',
                },
              },
              score: {
                increment: pointValue,
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
    const { cult } = await this.profileService.find({ id: profileId });

    this.check(postId);

    let pointValue: number = 1;

    const downvoted: boolean = await this.checkDownvoted(id, postId);
    const upvoted: boolean = await this.checkUpvoted(id, postId);

    if (upvoted) {
      await this.upvotePost(id, postId);
    }

    if (cult.role === CultRole.Ruler) pointValue = 2;

    try {
      const post = await this.prisma.post.update({
        where: {
          id: postId,
        },
        data: downvoted
          ? {
              votes: {
                delete: {
                  profileId_postId: { profileId, postId },
                },
              },
              score: {
                increment: pointValue,
              },
            }
          : {
              votes: {
                create: {
                  profileId,
                  type: 'Downvote',
                },
              },
              score: {
                decrement: pointValue,
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
          votes: {
            some: {
              profileId: profileId,
              type: 'Upvote',
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
          votes: {
            some: {
              profileId: profileId,
              type: 'Downvote',
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
