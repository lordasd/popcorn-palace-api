import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entities/showtime.entity';
import { Repository } from 'typeorm';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repository: Repository<ShowtimeEntity>;
  let moviesService: MoviesService;

  const testShowtime: ShowtimeEntity = {
    id: 1,
    movieId: 1,
    theater: 'Theater 1',
    startTime: new Date('2023-01-01T10:00:00Z'),
    endTime: new Date('2023-01-01T12:00:00Z'),
    price: 15.5,
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
  };

  const showtimeRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockMoviesService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(ShowtimeEntity),
          useValue: showtimeRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    repository = module.get<Repository<ShowtimeEntity>>(
      getRepositoryToken(ShowtimeEntity),
    );
    moviesService = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
