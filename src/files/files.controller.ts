import { Role } from '.prisma/client';
import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { FilesService } from './files.service';

@ApiTags('Files Endpoint')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiBearerAuth('Admin')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    for (const file of files) {
      await this.filesService.uploadPublicFile(file.buffer, file.originalname);
    }
  }

  @Delete(':id')
  @ApiBearerAuth('Admin')
  @UseGuards(RoleGuard(Role.Admin))
  async delete(@Param('id') id: string) {
    return this.filesService.deletePublicFile(id);
  }
}
