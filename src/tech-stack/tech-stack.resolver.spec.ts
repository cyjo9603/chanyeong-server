import { Test, TestingModule } from '@nestjs/testing';
import { TechStackResolver } from './tech-stack.resolver';

describe('TechStackResolver', () => {
  let resolver: TechStackResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechStackResolver],
    }).compile();

    resolver = module.get<TechStackResolver>(TechStackResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
