import { Module } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileModule } from 'src/profile/profile.module';
import { UserModule } from 'src/user/user.module';
import { CultController } from './cult.controller';
import { CultService } from './cult.service';

@Module({
  imports: [ProfileModule, UserModule],
  providers: [CultService, PrismaService, FilesService],
  controllers: [CultController],
})
export class CultModule {}