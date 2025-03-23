import { ConflictException, Injectable } from '@nestjs/common';
import { BookingEntity } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ShowtimesService } from '../showtimes/showtimes.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingsRepository: Repository<BookingEntity>,
    private readonly showtimesService: ShowtimesService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<BookingEntity> {
    await this.showtimesService.findOne(createBookingDto.showtimeId);
    const show = await this.bookingsRepository.findOne({
      where: {
        showtimeId: createBookingDto.showtimeId,
        seatNumber: createBookingDto.seatNumber,
      },
    });

    if (show)
      throw new ConflictException(
        `Seat ${createBookingDto.seatNumber} is already booked for this showtime`,
      );

    const booking = this.bookingsRepository.create(createBookingDto);
    return await this.bookingsRepository.save(booking);
  }
}
