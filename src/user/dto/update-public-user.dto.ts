import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdatePublicUserDto {
  @ApiProperty({
    name: 'username',
    example: 'jeffy.bezos+',
  })
  @IsString()
  @Length(4)
  username?: string;

  @ApiProperty({
    name: 'email',
    example: 'jeff.bezos@gmail.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    name: 'password',
    example: 'jeffbezos123',
  })
  @IsString()
  @Length(8)
  password?: string;
}
