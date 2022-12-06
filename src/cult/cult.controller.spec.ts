import { Test, TestingModule } from '@nestjs/testing';
import { CultController } from './cult.controller';

describe('CultController', () => {
  let controller: CultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CultController],
    }).compile();

    controller = module.get<CultController>(CultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
