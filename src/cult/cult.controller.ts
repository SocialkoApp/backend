import { CultService } from './cult.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserID } from 'src/user/user.decorator';
import { CreateCultDto } from './dto/create.dto';
import { GetCulteDto } from './dto/get-cult.dto';
import { Role } from '@prisma/client';

@ApiTags('Cult')
@Controller()
export class CultController {
  constructor(private readonly cultService: CultService) {}

  @Get('cults')
  async getAllCults() {
    return this.cultService.findAll();
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('c/:name')
  async getCult(@UserID() id: string, @Param() params: GetCulteDto) {
    return this.cultService.find(id, params.name);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('cult')
  async createCult(@UserID() id: string, @Body() body: CreateCultDto) {
    return this.cultService.createCult(id, body);
  }
}
