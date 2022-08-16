import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [FilesService, PrismaService],
  exports: [FilesService, PrismaService],
  controllers: [FilesController],
})
export class FilesModule {}
