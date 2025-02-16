import { Test, TestingModule } from '@nestjs/testing';
import { OpenSignService } from './opensign.service';

describe('OpensignService', () => {
  let service: OpenSignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenSignService],
    }).compile();

    service = module.get<OpenSignService>(OpenSignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
