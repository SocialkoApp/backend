import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty({
    name: 'name',
    example: 'BiktaturaB',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'description',
    example: 'A great org, yes',
  })
  @IsString()
  description?: string;
}
