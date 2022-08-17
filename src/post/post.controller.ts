import { CreatePostDto } from './dto/create.dto';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from './post.service';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Post()
  async uploadPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
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
