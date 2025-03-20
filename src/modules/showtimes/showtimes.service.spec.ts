import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import mock = jest.mock;
import { MoviesService } from '../movies/movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entities/showtime.entity';

describe('ShowtimesService', () => {
  let service: ShowtimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(ShowtimeEntity),
          useValue: mock,
        },
        {
          provide: MoviesService,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
