import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { V0alpha2Api } from '@ory/kratos-client';

@Injectable()
export class AuthService {
  public readonly api: V0alpha2Api;

  constructor(private readonly configService: ConfigService) {
    const kratosAdminUrl = this.configService.get<string>('KRATOS_URL');

    this.api = new V0alpha2Api(null, kratosAdminUrl);
  }
}
