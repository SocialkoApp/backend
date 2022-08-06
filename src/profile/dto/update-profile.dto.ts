import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    name: 'firstName',
    example: 'Jeff',
  })
  @IsString()
  firstName?: string;

  @ApiProperty({
    name: 'lastName',
    example: 'Bezos',
  })
  @IsString()
  lastName?: string;

  @ApiProperty({
    name: 'bio',
    example: "'03 | Vegova | Full-Stack Developer | @aerio.tech",
  })
  @IsString()
  bio?: string;
}
