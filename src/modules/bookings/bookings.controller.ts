import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{ bookingId: string }> {
    const booking = await this.bookingsService.create(createBookingDto);
    return { bookingId: booking.bookingId };
  }
}
