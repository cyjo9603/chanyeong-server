import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hash & compare password', () => {
    const password = 'sample';
    const hashedPassword = UserService.hashPassword(password);
    const comparedPassword = service.comparePassword(password, hashedPassword);

    expect(comparedPassword).toBe(true);
  });
});
