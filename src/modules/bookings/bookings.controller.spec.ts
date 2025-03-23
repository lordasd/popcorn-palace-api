import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import {
  ValidationPipe,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;
  let validationPipe: ValidationPipe;

  const testBooking = {
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
    showtimeId: 1,
    seatNumber: 42,
    userId: '123e4567-e89b-12d3-a456-426614174001',
  };

  const mockBookingsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
    validationPipe = new ValidationPipe({ transform: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a booking with valid data', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 42,
        userId: '123e4567-e89b-12d3-a456-426614174001',
      };

      mockBookingsService.create.mockResolvedValue(testBooking);

      const transformedDto = await validationPipe.transform(createBookingDto, {
        type: 'body',
        metatype: CreateBookingDto,
      } as any);

      const result = await controller.create(transformedDto);
      expect(result).toEqual({ bookingId: testBooking.bookingId });
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });

    it('should pass through ConflictException when seat is already booked', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 42,
        userId: '123e4567-e89b-12d3-a456-426614174001',
      };

      mockBookingsService.create.mockRejectedValue(
        new ConflictException('Seat 42 is already booked for this showtime'),
      );

      const transformedDto = await validationPipe.transform(createBookingDto, {
        type: 'body',
        metatype: CreateBookingDto,
      } as any);

      await expect(controller.create(transformedDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });

    it('should pass through NotFoundException when showtime does not exist', async () => {
      const createBookingDto: CreateBookingDto = {
        showtimeId: 999, // Non-existent showtime
        seatNumber: 42,
        userId: '123e4567-e89b-12d3-a456-426614174001',
      };

      mockBookingsService.create.mockRejectedValue(
        new NotFoundException('Showtime with ID 999 not found'),
      );

      const transformedDto = await validationPipe.transform(createBookingDto, {
        type: 'body',
        metatype: CreateBookingDto,
      } as any);

      await expect(controller.create(transformedDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.create).toHaveBeenCalledWith(transformedDto);
    });
  });
});
