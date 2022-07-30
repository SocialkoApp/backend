import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdatePublicUserDto {
  @ApiProperty({
    name: 'Username',
    example: 'jeffy.bezos+',
  })
  @IsString()
  @Length(4)
  username?: string;

  @ApiProperty({
    name: 'Email',
    example: 'jeff.bezos@gmail.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    name: 'Password',
    example: 'jeffbezos123',
  })
  @IsString()
  @Length(8)
  password?: string;
}
