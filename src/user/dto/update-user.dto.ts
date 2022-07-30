import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsJWT,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    name: 'Username',
    example: 'jeffy.bezos',
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

  @ApiProperty({
    name: 'Role',
    enum: Role,
  })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    name: 'Email Confirmed',
    example: false,
  })
  @IsBoolean()
  emailConfirmed?: boolean;

  @ApiProperty({
    name: 'Sent Email Confirmation',
    example: '2022-07-30T12:00:00Z',
  })
  @IsDate()
  emailConfirmationSentAt?: Date;

  @ApiProperty({
    name: 'Birth Date',
    example: '2003-12-18T16:32:00Z',
  })
  @IsDate()
  birthDate?: Date;

  @ApiProperty({
    name: 'Token',
    example: 'token',
  })
  @IsJWT()
  forgotPasswordToken?: string;
}
