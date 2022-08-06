import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  providers: [ProfileService, PrismaService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
