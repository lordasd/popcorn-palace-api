import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { MoviesService } from '../movies/movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entities/showtime.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repository: Repository<ShowtimeEntity>;
  let moviesService: MoviesService;

  const testShowtime: ShowtimeEntity = {
    id: 1,
    price: 15.5,
    movieId: 1,
    theater: 'Theater 1',
    startTime: new Date('2025-01-01T10:00:00Z'),
    endTime: new Date('2025-01-01T12:00:00Z'),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a showtime if found', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      const showtime = await service.findOne(1);

      expect(showtime).toEqual(testShowtime);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if showtime not found', async () => {
      showtimeRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      price: 15.5,
      theater: 'Theater 1',
      startTime: new Date('2025-01-01T14:00:00Z'),
      endTime: new Date('2025-01-01T16:00:00Z'),
    };

    it('should create and return a new showtime if valid', async () => {
      mockMoviesService.findById.mockResolvedValue({
        id: 1,
        title: 'Test Movie',
      });

      // Mock no overlapping showtimes
      mockQueryBuilder.getCount.mockResolvedValue(0);

      showtimeRepository.create.mockReturnValue(createShowtimeDto);
      showtimeRepository.save.mockResolvedValue({
        id: 2,
        ...createShowtimeDto,
      });

      const result = await service.create(createShowtimeDto);

      expect(moviesService.findById).toHaveBeenCalledWith(1);
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'showtimes.theater = :theater',
        { theater: 'Theater 1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtimes.startTime <= :endTime AND showtimes.endTime >= :startTime',
        {
          startTime: createShowtimeDto.startTime,
          endTime: createShowtimeDto.endTime,
        },
      );
      expect(repository.create).toHaveBeenCalledWith(createShowtimeDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 2, ...createShowtimeDto });
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      mockMoviesService.findById.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if showtime overlaps with existing one', async () => {
      mockMoviesService.findById.mockResolvedValue({
        id: 1,
        title: 'Test Movie',
      });

      // Mock overlapping showtimes
      mockQueryBuilder.getCount.mockResolvedValue(1);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateShowtimeDto: UpdateShowtimeDto = { price: 20.0 };

    const showTimeWithMovieUpdate: UpdateShowtimeDto = {
      movieId: 2,
      price: 20.0,
    };

    const showtimeWithTimeUpdate: UpdateShowtimeDto = {
      startTime: new Date('2025-01-01T14:00:00Z'),
      endTime: new Date('2025-01-01T16:00:00Z'),
    };

    it('should update an existing showtime with price only', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      showtimeRepository.merge.mockImplementation((entity, dto) =>
        Object.assign({}, entity, dto),
      );
      showtimeRepository.save.mockResolvedValue({
        ...testShowtime,
        ...updateShowtimeDto,
      });

      await service.update(1, updateShowtimeDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.createQueryBuilder).not.toHaveBeenCalled();
      expect(repository.merge).toHaveBeenCalledWith(
        testShowtime,
        updateShowtimeDto,
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('should check movie exists when updating movieId', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      mockMoviesService.findById.mockResolvedValue({
        id: 2,
        title: 'Another Movie',
      });
      showtimeRepository.merge.mockImplementation((entity, dto) =>
        Object.assign({}, entity, dto),
      );
      showtimeRepository.save.mockResolvedValue({
        ...testShowtime,
        ...showTimeWithMovieUpdate,
      });

      await service.update(1, showTimeWithMovieUpdate);

      expect(moviesService.findById).toHaveBeenCalledWith(2);
      expect(repository.merge).toHaveBeenCalledWith(
        testShowtime,
        showTimeWithMovieUpdate,
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('should check for overlapping showtimes when updating times', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      mockQueryBuilder.getCount.mockResolvedValue(0);
      showtimeRepository.merge.mockImplementation((entity, dto) =>
        Object.assign({}, entity, dto),
      );
      showtimeRepository.save.mockResolvedValue({
        ...testShowtime,
        ...showtimeWithTimeUpdate,
      });

      await service.update(1, showtimeWithTimeUpdate);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'showtimes.theater = :theater',
        { theater: testShowtime.theater },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtimes.startTime <= :endTime AND showtimes.endTime >= :startTime',
        {
          startTime: showtimeWithTimeUpdate.startTime,
          endTime: showtimeWithTimeUpdate.endTime,
        },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtimes.id != :excludeId',
        { excludeId: 1 },
      );
      expect(repository.merge).toHaveBeenCalledWith(
        testShowtime,
        showtimeWithTimeUpdate,
      );
      expect(repository.save).toHaveBeenCalled();
    });

    const existingShowtime = {
      ...testShowtime,
      startTime: new Date('2025-01-01T10:00:00Z'),
      endTime: new Date('2025-01-01T12:00:00Z'),
    };

    it('should handle partial update with only endTime', async () => {
      const endTimeUpdate = {
        endTime: new Date('2025-01-01T14:00:00Z'),
      };

      showtimeRepository.findOne.mockResolvedValue(existingShowtime);
      mockQueryBuilder.getCount.mockResolvedValue(0);
      showtimeRepository.merge.mockImplementation((entity, dto) =>
        Object.assign({}, entity, dto),
      );
      showtimeRepository.save.mockResolvedValue({
        ...existingShowtime,
        ...endTimeUpdate,
      });

      await service.update(1, endTimeUpdate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtimes.startTime <= :endTime AND showtimes.endTime >= :startTime',
        {
          startTime: existingShowtime.startTime,
          endTime: endTimeUpdate.endTime,
        },
      );
    });

    it('should handle partial update with only startTime', async () => {
      const startTimeUpdate = {
        startTime: new Date('2025-01-01T09:00:00Z'),
      };

      showtimeRepository.findOne.mockResolvedValue(existingShowtime);
      mockQueryBuilder.getCount.mockResolvedValue(0);

      await service.update(1, startTimeUpdate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'showtimes.startTime <= :endTime AND showtimes.endTime >= :startTime',
        {
          startTime: startTimeUpdate.startTime,
          endTime: existingShowtime.endTime,
        },
      );
    });

    it('should throw BadRequestException if updated showtime overlaps', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      mockQueryBuilder.getCount.mockResolvedValue(1);

      await expect(service.update(1, showtimeWithTimeUpdate)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if showtime to update is not found', async () => {
      showtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateShowtimeDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if movie does not exist when updating movieId', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      mockMoviesService.findById.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      await expect(service.update(1, showTimeWithMovieUpdate)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove an existing showtime', async () => {
      showtimeRepository.findOne.mockResolvedValue(testShowtime);
      showtimeRepository.remove.mockResolvedValue(testShowtime);

      await service.delete(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(testShowtime);
    });

    it('should throw NotFoundException if showtime to delete is not found', async () => {
      showtimeRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
