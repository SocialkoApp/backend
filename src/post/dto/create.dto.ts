import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    name: 'description',
    example: 'CEO entrepreneur born in 1964',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    name: 'imageId',
    example: '1cf744ab-3f18-4f7c-a266-e1d2486a9de7',
  })
  @IsString()
  imageId: string;
  @ApiProperty({
    name: 'type',
    example: 'Text',
  })
  @IsString()
  type: PostType;
}

enum PostType {
  Text = 'Text',
  Image = 'Image',
}
