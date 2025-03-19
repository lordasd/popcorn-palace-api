import { Test, TestingModule } from '@nestjs/testing';
import { showtimeProviders } from './showtime.providers';

describe('ShowtimeProviders', () => {
  let provider: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...showtimeProviders],
    }).compile();

    provider = module.get('SHOWTIME_REPOSITORY');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
