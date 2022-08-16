import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Endpoint, S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private readonly logger = new Logger();

  async uploadPrivateFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3({
      endpoint: new Endpoint(this.config.get('S3_ENDPOINT')),
    });

    const uploadResult = await s3
      .upload({
        Bucket: this.config.get('S3_BUCKET'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    return await this.prisma.privateFile.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    });
  }

  async deletePrivateFile(fileId: number) {
    const file = await this.prisma.privateFile.findUnique({
      where: { id: fileId },
    });
    const s3 = new S3({
      endpoint: new Endpoint(this.config.get('S3_ENDPOINT')),
    });
    await s3
      .deleteObject({
        Bucket: this.config.get('S3_BUCKET'),
        Key: file.key,
      })
      .promise();
    return await this.prisma.publicFile.delete({ where: { id: fileId } });
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    this.logger.verbose(`Uploading ${filename}`);
    const s3 = new S3({
      endpoint: new Endpoint(this.config.get('S3_ENDPOINT')),
    });

    const uploadResult = await s3
      .upload({
        Bucket: this.config.get('S3_BUCKET'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();

    const file = await this.prisma.publicFile.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
      },
    });
    this.logger.verbose(
      `File ${filename} uploaded to ${uploadResult.Location}`,
    );
    return file;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.prisma.publicFile.findUnique({
      where: { id: fileId },
    });
    const s3 = new S3({
      endpoint: new Endpoint(this.config.get('S3_ENDPOINT')),
    });
    await s3
      .deleteObject({
        Bucket: this.config.get('S3_BUCKET'),
        Key: file.key,
      })
      .promise();
    return await this.prisma.publicFile.delete({ where: { id: fileId } });
  }
}
