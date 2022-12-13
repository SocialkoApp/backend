import { CultService } from './cult.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserID } from 'src/user/user.decorator';
import { CreateCultDto } from './dto/create.dto';

@ApiTags('Cult')
@Controller('cult')
export class CultController {
  constructor(private readonly cultService: CultService) {}

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCults() {
    return this.cultService.findAll();
  }

  @ApiBearerAuth('User')
  @ApiBearerAuth('Admin')
  @UseGuards(JwtAuthGuard)
  @Post()
  async createCult(@UserID() id: string, @Body() body: CreateCultDto) {
    return this.cultService.createCult(id, body);
  }
}
