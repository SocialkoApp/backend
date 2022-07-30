import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfirmationService } from './email-confirmation.service';

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailConfirmationService],
    }).compile();

    service = module.get<EmailConfirmationService>(EmailConfirmationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
