import { Test, TestingModule } from '@nestjs/testing';
import { StartupService } from './startup.service';

describe('StartupService', () => {
  let service: StartupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartupService],
    }).compile();

    service = module.get<StartupService>(StartupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
