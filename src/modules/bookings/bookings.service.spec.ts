import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<BookingEntity>;
  let showtimesService: ShowtimesService;

  const testBooking: BookingEntity = {
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
    showtimeId: 1,
    seatNumber: 42,
    userId: '123e4567-e89b-12d3-a456-426614174001',
  };

  const mockBookingsRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockShowtimesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: mockBookingsRepository,
        },
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<BookingEntity>>(
      getRepositoryToken(BookingEntity),
    );
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 42,
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    const testShowtimes = {
      id: 1,
      price: 15.5,
      movieId: 1,
      theater: 'Theater 1',
      startTime: new Date(),
      endTime: new Date(),
    };

    it('should create and return a new booking if seat is available', async () => {
      mockShowtimesService.findOne.mockResolvedValue(testShowtimes);
      mockBookingsRepository.findOne.mockResolvedValue(null);
      mockBookingsRepository.create.mockReturnValue(createBookingDto);
      mockBookingsRepository.save.mockResolvedValue({
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        ...createBookingDto,
      });

      const result = await service.create(createBookingDto);

      expect(showtimesService.findOne).toHaveBeenCalledWith(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          showtimeId: 1,
          seatNumber: 42,
        },
      });
      expect(repository.create).toHaveBeenCalledWith(createBookingDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({
        bookingId: '123e4567-e89b-12d3-a456-426614174000',
        ...createBookingDto,
      });
    });

    it('should throw ConflictException if the seat is already booked', async () => {
      mockShowtimesService.findOne.mockResolvedValue(testShowtimes);
      mockBookingsRepository.findOne.mockResolvedValue(testBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if showtime does not exist', async () => {
      mockShowtimesService.findOne.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      await expect(
        service.create({
          ...createBookingDto,
          showtimeId: 999,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findOne).not.toHaveBeenCalled();
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
