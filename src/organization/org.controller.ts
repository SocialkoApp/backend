import { UpdateOrganizationDto } from './dto/update-org.dto';
import { ManageRequestDto } from './dto/manage-request.dto';
import { Action, OrganizationService, RequestAction } from './org.service';
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
import { CreateOrganizationDto } from './dto/create.dto';
import { GetOrganizationDto } from './dto/get-org.dto';
import { Role } from '@prisma/client';
import { ManageMemberDto } from './dto/manage-member.dto';
import { JoinRequestDto } from './dto/join-request.dto';
import { UpdateOrganizationIconDto } from './dto/update-org-icon.dto';

@ApiTags('Organization')
@Controller()
export class OrganizationController {
  constructor(private readonly OrganizationService: OrganizationService) {}

  @Get('orgs')
  async getAllOrgs() {
    return this.OrganizationService.findAll();
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('o/:name')
  async getOrg(@UserID() id: string, @Param() params: GetOrganizationDto) {
    return this.OrganizationService.findByName(id, params.name);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('org')
  async createOrg(@UserID() id: string, @Body() body: CreateOrganizationDto) {
    return this.OrganizationService.createOrg(id, body);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('org')
  async getMyOrg(@UserID() id: string) {
    return this.OrganizationService.findMyOrganization(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('org')
  async updateMyOrganization(
    @UserID() id: string,
    @Body() body: UpdateOrganizationDto,
  ) {
    return this.OrganizationService.updateMyOrganization(id, body);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('org/icon')
  async updateOrgIcon(
    @UserID() id: string,
    @Body() body: UpdateOrganizationIconDto,
  ) {
    return this.OrganizationService.updateMyOrganizationIcon(id, body.fileId);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('org/request/:organizationId')
  async joinRequest(@UserID() id: string, @Param() params: JoinRequestDto) {
    return this.OrganizationService.joinRequest(id, params.organizationId);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('org/members')
  async members(@UserID() id: string) {
    return this.OrganizationService.findMembers(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('org/requests')
  async requests(@UserID() id: string) {
    return this.OrganizationService.findRequests(id);
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('org/request/accept/:id')
  async requestAccept(@UserID() id: string, @Param() params: ManageRequestDto) {
    return this.OrganizationService.manageRequest(
      id,
      params.id,
      RequestAction.Accept,
    );
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('org/request/decline/:id')
  async requestDecline(
    @UserID() id: string,
    @Param() params: ManageRequestDto,
  ) {
    return this.OrganizationService.manageRequest(
      id,
      params.id,
      RequestAction.Decline,
    );
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('org/add/:username')
  async addMember(@UserID() id: string, @Param() params: ManageMemberDto) {
    return this.OrganizationService.manageMembership(
      id,
      params.username,
      Action.Add,
    );
  }

  @ApiBearerAuth(Role.User)
  @ApiBearerAuth(Role.Admin)
  @UseGuards(JwtAuthGuard)
  @Put('org/remove/:username')
  async removeMember(@UserID() id: string, @Param() params: ManageMemberDto) {
    return this.OrganizationService.manageMembership(
      id,
      params.username,
      Action.Remove,
    );
  }
}
