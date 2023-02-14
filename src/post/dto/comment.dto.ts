import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentPostDto {
  @ApiProperty({
    name: 'postId',
    example: '1cf744ab-3f18-4f7c-a266-e1d2486a9de7',
  })
  @IsString()
  postId: string;

  @ApiProperty({
    name: 'content',
    example: 'Wow you look good Jeff!!',
  })
  @IsString()
  content: string;
}
