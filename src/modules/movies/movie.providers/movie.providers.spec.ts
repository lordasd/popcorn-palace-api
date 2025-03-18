import { Test, TestingModule } from '@nestjs/testing';
import { movieProviders } from './movie.providers';

describe('MovieProviders', () => {
  let provider: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...movieProviders],
    }).compile();

    provider = module.get('MOVIE_REPOSITORY');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
