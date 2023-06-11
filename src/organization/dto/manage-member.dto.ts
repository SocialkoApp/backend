import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ManageMemberDto {
  @ApiProperty({
    name: 'name',
    example: 'jeffy.bezos',
  })
  @IsString()
  username: string;
}
