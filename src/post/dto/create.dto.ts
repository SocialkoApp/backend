import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    name: 'description',
    example: 'CEO entrepreneur born in 1964',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    name: 'imageId',
    example: 1,
  })
  @IsInt()
  imageId: string;
}
