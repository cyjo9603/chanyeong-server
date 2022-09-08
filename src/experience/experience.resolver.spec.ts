import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceResolver } from './experience.resolver';

describe('ExperienceResolver', () => {
  let resolver: ExperienceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceResolver],
    }).compile();

    resolver = module.get<ExperienceResolver>(ExperienceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
