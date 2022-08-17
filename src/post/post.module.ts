import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ProfileModule } from 'src/profile/profile.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [ProfileModule],
  providers: [PostService, PrismaService, FilesService],
  controllers: [PostController],
})
export class PostModule {}
