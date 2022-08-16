import { Module } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UserModule],
  providers: [ProfileService, PrismaService, FilesService],
  controllers: [ProfileController],
})
export class ProfileModule {}
