import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendConfirmEmailDto {
  @ApiProperty({
    name: 'Email',
    example: 'jeff.bezos@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
