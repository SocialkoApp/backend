import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsJWT,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    name: 'username',
    example: 'jeffy.bezos',
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

  @ApiProperty({
    name: 'role',
    enum: Role,
  })
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    name: 'emailConfirmed',
    example: false,
  })
  @IsBoolean()
  emailConfirmed?: boolean;

  @ApiProperty({
    name: 'emailConfirmationSentAt',
    example: '2022-07-30T12:00:00Z',
  })
  @IsDate()
  emailConfirmationSentAt?: Date;

  @ApiProperty({
    name: 'forgotPasswordToken',
    example: 'forgotPasswordToken',
  })
  @IsJWT()
  forgotPasswordToken?: string;
}
