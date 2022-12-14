import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { FilesService } from './files.service';

@ApiTags('Files Endpoint')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth(Role.Admin)
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
  @Post('many')
  async upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    for (const file of files) {
      await this.filesService.uploadPublicFile(file.buffer, file.originalname);
    }
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadPublicFile(file.buffer, file.originalname);
  }

  @ApiBearerAuth(Role.Admin)
  @UseGuards(RoleGuard(Role.Admin))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.filesService.deletePublicFile(id);
  }
}
