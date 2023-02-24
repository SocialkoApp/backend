import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinRequestDto {
  @ApiProperty({
    name: 'cultId',
    example: '1cf744ab-3f18-4f7c-a266-e1d2486a9de7',
  })
  @IsString()
  cultId: string;
}
