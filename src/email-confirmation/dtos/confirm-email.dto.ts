import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    name: 'Token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
