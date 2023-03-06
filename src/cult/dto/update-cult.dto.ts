import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCultDto {
  @ApiProperty({
    name: 'name',
    example: 'BiktaturaB',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    name: 'description',
    example: 'A great cult, yes',
  })
  @IsString()
  description?: string;
}
