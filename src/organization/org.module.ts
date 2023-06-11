import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileModule } from 'src/profile/profile.module';
import { ProfileService } from 'src/profile/profile.service';
import { UserModule } from 'src/user/user.module';
import { OrganizationController } from './org.controller';
import { OrganizationService } from './org.service';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [ProfileModule, UserModule],
  providers: [OrganizationService, PrismaService, ProfileService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
