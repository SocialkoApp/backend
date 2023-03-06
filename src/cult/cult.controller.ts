import { UpdateCultDto } from './dto/update-cult.dto';
import { ManageRequestDto } from './dto/manage-request.dto';
import { Action, CultService, RequestAction } from './cult.service';
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
import { ManageMemberDto } from './dto/manage-member.dto';
import { JoinRequestDto } from './dto/join-request.dto';
import { UpdateCultIconDto } from './dto/update-cult-icon.dto';

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
    return this.cultService.findByName(id, params.name);
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
  @Get('cult')
  async getMyCult(@UserID() id: string) {
    return this.cultService.findMyCult(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult')
  async updateMyCult(@UserID() id: string, @Body() body: UpdateCultDto) {
    return this.cultService.updateMyCult(id, body);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('cult/icon')
  async updateCultIcon(@UserID() id: string, @Body() body: UpdateCultIconDto) {
    return this.cultService.updateMyCultIcon(id, body.fileId);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('cult/request/:cultId')
  async joinRequest(@UserID() id: string, @Param() params: JoinRequestDto) {
    return this.cultService.joinRequest(id, params.cultId);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('cult/members')
  async members(@UserID() id: string) {
    return this.cultService.findMembers(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('cult/requests')
  async requests(@UserID() id: string) {
    return this.cultService.findRequests(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/request/accept/:id')
  async requestAccept(@UserID() id: string, @Param() params: ManageRequestDto) {
    return this.cultService.manageRequest(id, params.id, RequestAction.Accept);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/request/decline/:id')
  async requestDecline(
    @UserID() id: string,
    @Param() params: ManageRequestDto,
  ) {
    return this.cultService.manageRequest(id, params.id, RequestAction.Decline);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/add/:username')
  async addCultMember(@UserID() id: string, @Param() params: ManageMemberDto) {
    return this.cultService.manageMembership(id, params.username, Action.Add);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('cult/remove/:username')
  async removeCultMember(
    @UserID() id: string,
    @Param() params: ManageMemberDto,
  ) {
    return this.cultService.manageMembership(
      id,
      params.username,
      Action.Remove,
    );
  }
}
