import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { ShowtimesService } from '../showtimes/showtimes.service';
import mock = jest.mock;
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(BookingEntity),
          useValue: mock,
        },
        {
          provide: ShowtimesService,
          useValue: mock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
