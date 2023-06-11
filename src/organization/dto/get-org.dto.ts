import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetOrganizationDto {
  @ApiProperty({
    name: 'name',
    example: 'Vegovacraft',
  })
  @IsString()
  name: string;
}
