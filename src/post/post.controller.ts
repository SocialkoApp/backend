import { VotePostDto } from './dto/vote-post.dto';
import { GetUserPostsDto } from './dto/get-posts.dto';
import { CreatePostDto } from './dto/create.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from './post.service';
import { GetPostDto } from './dto/get-post.dto';
import { UserID } from 'src/user/user.decorator';
import { Role } from '@prisma/client';
import { CommentPostDto } from './dto/comment.dto';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyPosts(@UserID() id: string) {
    return this.postService.getMyPosts(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPostById(@UserID() id: string, @Param() params: GetPostDto) {
    return this.postService.getPost(id, params.id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('user/:username')
  async getPostsByUsername(
    @UserID() id: string,
    @Param() params: GetUserPostsDto,
  ) {
    return this.postService.getUserPosts(id, params.username);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@UserID() id: string) {
    return this.postService.getPosts(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post()
  async uploadPost(@UserID() id: string, @Body() body: CreatePostDto) {
    return this.postService.createPost(id, body);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('upvote/:id')
  async upvotePost(@UserID() id: string, @Param() params: VotePostDto) {
    return this.postService.upvotePost(id, params.id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('downvote/:id')
  async downvotePost(@UserID() id: string, @Param() params: VotePostDto) {
    return this.postService.downvotePost(id, params.id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('comment')
  async commentPost(@UserID() id: string, @Body() body: CommentPostDto) {
    return this.postService.commentPost(id, body);
  }
}
