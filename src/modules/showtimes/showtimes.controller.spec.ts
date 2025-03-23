import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import {
  ValidationPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { IsAfterDateConstraint } from './dto/date-validation.decorator';
import { ShowtimeEntity } from './entities/showtime.entity';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;
  let validationPipe: ValidationPipe;

  const testShowtime: ShowtimeEntity = {
    id: 1,
    price: 15.5,
    movieId: 1,
    theater: 'Theater 1',
    startTime: new Date('2025-01-01T10:00:00Z'),
    endTime: new Date('2025-01-01T12:00:00Z'),
  };

  const mockShowtimesService = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
    validationPipe = new ValidationPipe({ transform: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a showtime when it exists', async () => {
      mockShowtimesService.findOne.mockResolvedValue(testShowtime);

      const result = await controller.findOne(1);

      expect(result).toEqual(testShowtime);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should pass through NotFoundException when showtime does not exist', async () => {
      mockShowtimesService.findOne.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a showtime with valid data', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 1,
        price: 15.5,
        theater: 'Theater 1',
        startTime: new Date('2025-01-01T10:00:00Z'),
        endTime: new Date('2025-01-01T12:00:00Z'),
      };

      mockShowtimesService.create.mockResolvedValue({
        id: 1,
        ...createShowtimeDto,
      });

      const transformedDto = await validationPipe.transform(createShowtimeDto, {
        type: 'body',
        metatype: CreateShowtimeDto,
      } as any);

      const result = await controller.create(transformedDto);
      expect(result).toEqual({ id: 1, ...createShowtimeDto });
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });

    it('should throw validation error when end time is before start time', async () => {
      const invalidShowtimeDto = {
        price: 15.5,
        movieId: 1,
        theater: 'Theater 1',
        startTime: new Date('2025-01-01T12:00:00Z'), // Later time
        endTime: new Date('2025-01-01T10:00:00Z'), // Earlier time
      };

      // Test the validator constraint directly
      const constraint = new IsAfterDateConstraint();
      const isValid = constraint.validate(invalidShowtimeDto.endTime, {
        constraints: ['startTime'],
        object: invalidShowtimeDto,
        property: 'endTime',
        value: invalidShowtimeDto.endTime,
        targetName: 'CreateShowtimeDto',
      } as any);

      expect(isValid).toBe(false);

      // Expect the validation pipe to throw an error
      await expect(
        validationPipe.transform(invalidShowtimeDto, {
          type: 'body',
          metatype: CreateShowtimeDto,
        } as any),
      ).rejects.toThrow();
    });

    it('should handle service errors and pass them through', async () => {
      const createShowtimeDto: CreateShowtimeDto = {
        movieId: 999, // Non-existent movie
        theater: 'Theater 1',
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T12:00:00Z'),
        price: 15.5,
      };

      mockShowtimesService.create.mockRejectedValue(
        new NotFoundException('Movie with ID 999 not found'),
      );

      const transformedDto = await validationPipe.transform(createShowtimeDto, {
        type: 'body',
        metatype: CreateShowtimeDto,
      } as any);

      await expect(controller.create(transformedDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });
  });

  describe('update', () => {
    it('should update a showtime with valid data', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 20.0,
      };

      mockShowtimesService.update.mockResolvedValue(undefined);

      const transformedDto = await validationPipe.transform(updateShowtimeDto, {
        type: 'body',
        metatype: UpdateShowtimeDto,
      } as any);

      await controller.update(1, transformedDto);
      expect(service.update).toHaveBeenCalledWith(1, transformedDto);
    });

    it('should validate time ranges in update', async () => {
      const invalidUpdateDto = {
        startTime: new Date('2025-01-01T12:00:00Z'),
        endTime: new Date('2025-01-01T10:00:00Z'),
      };

      // Test the validator constraint directly for update DTO
      const constraint = new IsAfterDateConstraint();
      const isValid = constraint.validate(invalidUpdateDto.endTime, {
        constraints: ['startTime'],
        object: invalidUpdateDto,
        property: 'endTime',
        value: invalidUpdateDto.endTime,
        targetName: 'UpdateShowtimeDto',
      } as any);

      expect(isValid).toBe(false);

      await expect(
        validationPipe.transform(invalidUpdateDto, {
          type: 'body',
          metatype: UpdateShowtimeDto,
        } as any),
      ).rejects.toThrow();
    });

    it('should handle service errors during update', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        theater: 'Busy Theater',
        startTime: new Date('2025-01-01T14:00:00Z'),
        endTime: new Date('2025-01-01T16:00:00Z'),
      };

      mockShowtimesService.update.mockRejectedValue(
        new BadRequestException('Show time overlaps with another show time'),
      );

      const transformedDto = await validationPipe.transform(updateShowtimeDto, {
        type: 'body',
        metatype: UpdateShowtimeDto,
      } as any);

      await expect(controller.update(1, transformedDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith(1, transformedDto);
    });

    it('should throw NotFoundException when updating non-existent showtime', async () => {
      const updateShowtimeDto: UpdateShowtimeDto = {
        price: 20.0,
      };

      mockShowtimesService.update.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      const transformedDto = await validationPipe.transform(updateShowtimeDto, {
        type: 'body',
        metatype: UpdateShowtimeDto,
      } as any);

      await expect(controller.update(999, transformedDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, transformedDto);
    });
  });

  describe('delete', () => {
    it('should delete an existing showtime', async () => {
      mockShowtimesService.delete.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent showtime', async () => {
      mockShowtimesService.delete.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
      expect(service.delete).toHaveBeenCalledWith(999);
    });
  });
});
