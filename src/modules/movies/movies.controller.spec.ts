import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieEntity } from './entities/movie.entity';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const testMovie: MovieEntity = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  };

  const mockMoviesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockMoviesService.findAll.mockResolvedValue([testMovie]);
      const movies = await controller.findAll();

      expect(movies).toEqual([testMovie]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a new movie', async () => {
      const createMovieDto = {
        title: 'New Movie',
        genre: 'Comedy',
        duration: 90,
        rating: 7.5,
        releaseYear: 2021,
      };

      mockMoviesService.create.mockResolvedValue(createMovieDto);
      const movie = await controller.create(createMovieDto);

      expect(movie).toEqual(createMovieDto);
      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const movieTitle = 'Test Movie';
      const updateMovieDto = { genre: 'Comedy' };

      mockMoviesService.update.mockResolvedValue(undefined);
      const result = await controller.update(movieTitle, updateMovieDto);

      expect(result).toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(movieTitle, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing movie', async () => {
      const movieTitle = 'Test Movie';

      mockMoviesService.remove.mockResolvedValue(undefined);
      const result = await controller.remove(movieTitle);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(movieTitle);
    });
  });
});
