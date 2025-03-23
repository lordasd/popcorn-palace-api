import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieEntity } from './entities/movie.entity';
import {
  ConflictException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;
  let validationPipe: ValidationPipe;

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
    validationPipe = new ValidationPipe({ transform: true });
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

      const transformedDto = await validationPipe.transform(createMovieDto, {
        type: 'body',
        metatype: CreateMovieDto,
      } as any);

      const movie = await controller.create(transformedDto);

      expect(movie).toEqual(createMovieDto);
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });

    it('should throw a ConflictException if movie already exists', async () => {
      const createMovieDto = {
        title: testMovie.title,
        genre: testMovie.genre,
        duration: testMovie.duration,
        rating: testMovie.rating,
        releaseYear: testMovie.releaseYear,
      };

      mockMoviesService.create.mockRejectedValue(
        new ConflictException(
          `Movie with title ${testMovie.title} already exists`,
        ),
      );

      const transformedDto = await validationPipe.transform(createMovieDto, {
        type: 'body',
        metatype: CreateMovieDto,
      } as any);

      await expect(controller.create(transformedDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const movieTitle = 'Test Movie';
      const updateMovieDto = { genre: 'Comedy' };

      mockMoviesService.update.mockResolvedValue(undefined);

      const transformedDto = await validationPipe.transform(updateMovieDto, {
        type: 'body',
        metatype: UpdateMovieDto,
      } as any);

      const result = await controller.update(movieTitle, transformedDto);

      expect(result).toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(movieTitle, transformedDto);
    });

    it('should throw a NotFoundException if movie does not exist', async () => {
      const nonExistentMovieTitle = 'Non Existent Movie';
      const updateMovieDto = { genre: 'Comedy' };

      const transformedDto = await validationPipe.transform(updateMovieDto, {
        type: 'body',
        metatype: UpdateMovieDto,
      } as any);

      mockMoviesService.update.mockRejectedValue(
        new NotFoundException(
          `Movie with title ${nonExistentMovieTitle} not found`,
        ),
      );

      await expect(
        controller.update(nonExistentMovieTitle, transformedDto),
      ).rejects.toThrow(NotFoundException);

      expect(service.update).toHaveBeenCalledWith(
        nonExistentMovieTitle,
        transformedDto,
      );
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

    it('should throw a NotFoundException if movie does not exist', async () => {
      const nonExistentMovieTitle = 'Non Existent Movie';

      mockMoviesService.remove.mockRejectedValue(
        new NotFoundException(
          `Movie with title ${nonExistentMovieTitle} not found`,
        ),
      );

      await expect(controller.remove(nonExistentMovieTitle)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(nonExistentMovieTitle);
    });
  });
});
