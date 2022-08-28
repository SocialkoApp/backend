import { UpDownvotePostDto } from './dto/upvoteDownvotePost.dto';
import { GetUserPostsDto } from './dto/getPosts.dto';
import { CreatePostDto } from './dto/create.dto';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from './post.service';
import { GetPostDto } from './dto/getPost.dto';
import { UserId } from 'src/user/user.decorator';
import { identity } from 'rxjs';

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyPosts(@UserId() id: number) {
    return this.postService.getMyPosts(id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPostById(@Param() params: GetPostDto) {
    return this.postService.getPost(params.id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get('user/:username')
  async getPostsByUsername(@Param() params: GetUserPostsDto) {
    return this.postService.getUserPosts(params.username);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(@UserId() id: number) {
    return this.postService.getPosts(id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Post()
  async uploadPost(@UserId() id: number, @Body() body: CreatePostDto) {
    return this.postService.createPost(id, body);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Put('upvote/:id')
  async upvotePost(@UserId() id: number, @Param() params: UpDownvotePostDto) {
    if (this.postService.checkUpvoted(id, params.id)) {
      throw new ConflictException('You have already upvoted this post');
    }
    return this.postService.upvotePost(id, params.id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Put('downvote/:id')
  async downvotePost(@UserId() id: number, @Param() params: UpDownvotePostDto) {
    if (this.postService.checkDownvoted(id, params.id)) {
      throw new ConflictException('You have already downvoted this post');
    }
    return this.postService.downvotePost(id, params.id);
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('image')
  async uploadPostImage(@UploadedFile() file: Express.Multer.File) {
    return this.postService.uploadPostImage(file.buffer, file.originalname);
  }
}
