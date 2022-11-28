import { ApiHideProperty } from '@nestjs/swagger';
import { PublicFile as PrismaPublicFile } from '@prisma/client';

export class PublicFile implements PrismaPublicFile {
  @ApiHideProperty()
  id: string;

  url: string;

  @ApiHideProperty()
  key: string;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;
}
