import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovieRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const expectedMovies = [
        {
          id: 1,
          title: 'Test Movie 1',
          genre: 'Action',
          duration: 120,
          rating: 8.7,
          releaseYear: 2025,
        },
        {
          id: 2,
          title: 'Test Movie 2',
          genre: 'Comedy',
          duration: 90,
          rating: 7.5,
          releaseYear: 2024,
        },
      ];

      mockMovieRepository.find.mockResolvedValue(expectedMovies);

      const result = await service.findAll();
      expect(result).toEqual(expectedMovies);
      expect(mockMovieRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
