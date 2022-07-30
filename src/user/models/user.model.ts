import { ApiProperty } from '@nestjs/swagger';
import Prisma from '@prisma/client';
import { Expose } from 'class-transformer';

export class User implements Prisma.User {
  id: string;

  @ApiProperty({
    description: 'Email',
    example: 'jeff.bezos@gmail.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'First name',
    example: 'Jeff',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Bezos',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'Username',
    example: 'bezosjeffy',
  })
  @Expose()
  username: string;

  updatedAt: Date;
  createdAt: Date;
}
