import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    name: 'name',
    example: 'Vegovacraft',
  })
  @Matches('[a-z0-9_.-]{3,16}$')
  @IsString()
  name: string;

  @ApiProperty({
    name: 'description',
    example: 'Ja... Sam ja...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    name: 'iconId',
    example: '1cf744ab-3f18-4f7c-a266-e1d2486a9de7',
  })
  @IsString()
  iconId: string;
}
