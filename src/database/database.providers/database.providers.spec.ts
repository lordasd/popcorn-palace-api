import { Test, TestingModule } from '@nestjs/testing';
import { databaseProviders } from './database.providers';

describe('DatabaseProviders', () => {
  let provider: any[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...databaseProviders],
    }).compile();

    provider = module.get('DATA_SOURCE');
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
