import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    name: 'username',
    example: 'jeffy.bezos',
  })
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    name: 'email',
    example: 'jeff.bezos@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    example: 'jeffbezos123',
  })
  @IsNotEmpty()
  @Length(8, 128)
  password: string;

  @ApiProperty({
    name: 'firstName',
    example: 'Jeff',
  })
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @ApiProperty({
    name: 'lastName',
    example: 'Bezos',
  })
  @IsNotEmpty()
  @MaxLength(20)
  lastName: string;
}
