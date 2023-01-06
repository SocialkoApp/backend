import { Action, CultService } from './cult.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserID } from 'src/user/user.decorator';
import { CreateCultDto } from './dto/create.dto';
import { GetCulteDto } from './dto/get-cult.dto';
import { Role } from '@prisma/client';
import { AddMemberDto } from './dto/add-member.dto';

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

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/add/:username')
  async addCultMember(@UserID() id: string, @Param() params: AddMemberDto) {
    return this.cultService.manageMembership(id, params.username, Action.Add);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/remove/:username')
  async removeCultMember(@UserID() id: string, @Param() params: AddMemberDto) {
    return this.cultService.manageMembership(
      id,
      params.username,
      Action.Remove,
    );
  }
}
