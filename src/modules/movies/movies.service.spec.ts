import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<MovieEntity>;

  const testMovie: MovieEntity = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2020,
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MovieEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<MovieEntity>>(
      getRepositoryToken(MovieEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockRepository.find.mockResolvedValue([testMovie]);
      const movies = await service.findAll();

      expect(movies).toEqual([testMovie]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByTitle', () => {
    it('should return a movie if found', async () => {
      mockRepository.findOne.mockResolvedValue(testMovie);
      const movie = await service.findByTitle('Test Movie');

      expect(movie).toEqual(testMovie);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { title: 'Test Movie' },
      });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByTitle('Nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return a movie if found', async () => {
      mockRepository.findOne.mockResolvedValue(testMovie);
      const movie = await service.findById(1);

      expect(movie).toEqual(testMovie);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new movie if title is unique', async () => {
      const createMovieDto = {
        title: 'New Movie',
        genre: 'Drama',
        duration: 100,
        rating: 7.2,
        releaseYear: 2021,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createMovieDto);
      mockRepository.save.mockResolvedValue(createMovieDto);

      const movie = await service.create(createMovieDto);

      expect(movie).toEqual(createMovieDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { title: createMovieDto.title },
      });
      expect(repository.create).toHaveBeenCalledWith(createMovieDto);
      expect(repository.save).toHaveBeenCalledWith(createMovieDto);
    });

    it('should throw ConflictException if a movie with the same title exists', async () => {
      const createMovieDto = {
        title: 'Test Movie',
        genre: 'Drama',
        duration: 100,
        rating: 7.2,
        releaseYear: 2021,
      };

      mockRepository.findOne.mockResolvedValue(testMovie);

      await expect(service.create(createMovieDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const movieTitle = 'Test Movie';
      const updateMovieDto = { genre: 'Comedy' };
      mockRepository.findOne.mockResolvedValue(testMovie);
      mockRepository.merge.mockImplementation((entity, dto) =>
        Object.assign(entity, dto),
      );
      mockRepository.save.mockResolvedValue({
        ...testMovie,
        ...updateMovieDto,
      });

      await service.update(movieTitle, updateMovieDto);

      expect(repository.merge).toHaveBeenCalledWith(testMovie, updateMovieDto);
      expect(repository.save).toHaveBeenCalledWith(testMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const updateMovieDto = { genre: 'Comedy' };
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('Nonexistent', updateMovieDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an existing movie', async () => {
      const movieTitle = 'Test Movie';
      mockRepository.findOne.mockResolvedValue(testMovie);
      mockRepository.remove.mockResolvedValue(testMovie);

      await service.remove(movieTitle);
      expect(repository.remove).toHaveBeenCalledWith(testMovie);
    });

    it('should throw NotFoundException if movie is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('Nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
