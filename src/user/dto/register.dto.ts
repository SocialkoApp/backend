import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    name: 'Username',
    example: 'jeffy.bezos',
  })
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @ApiProperty({
    name: 'Email',
    example: 'jeff.bezos@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'Password',
    example: 'jeffbezos123',
  })
  @IsNotEmpty()
  @Length(1, 64)
  password: string;

  @ApiProperty({
    name: 'First Name',
    example: 'Jeff',
  })
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @ApiProperty({
    name: 'Last Name',
    example: 'Bezos',
  })
  @IsNotEmpty()
  @MaxLength(20)
  lastName: string;
}
