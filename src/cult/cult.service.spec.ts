import { Test, TestingModule } from '@nestjs/testing';
import { CultService } from './cult.service';

describe('CultService', () => {
  let service: CultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CultService],
    }).compile();

    service = module.get<CultService>(CultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
