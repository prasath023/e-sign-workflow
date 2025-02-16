import { Test, TestingModule } from '@nestjs/testing';
import { OpenSignController } from './opensign.controller';

describe('OpenSignController', () => {
  let controller: OpenSignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenSignController],
    }).compile();

    controller = module.get<OpenSignController>(OpenSignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
