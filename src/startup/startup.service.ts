import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class StartupService implements OnModuleInit {
  onModuleInit() {
    if (process.send) process.send('ready');
  }
}
