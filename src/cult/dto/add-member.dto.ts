import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({
    name: 'name',
    example: 'jeffy.bezos',
  })
  @IsString()
  username: string;
}
