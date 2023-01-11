import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserPostsDto {
  @ApiProperty({
    name: 'id',
    example: 'aiken',
  })
  @IsString()
  username: string;
}
