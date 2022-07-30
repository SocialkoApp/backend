import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    name: 'username',
    example: 'jeffy.bezos',
  })
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @ApiProperty({
    name: 'Password',
    example: 'jeffbezos123',
  })
  @IsNotEmpty()
  @MaxLength(64)
  password: string;
}
