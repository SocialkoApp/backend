import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    name: 'code',
  })
  @IsJWT()
  code: string;

  @ApiProperty({
    name: 'password',
    example: 'new_password_123',
  })
  @IsString()
  password: string;
}
