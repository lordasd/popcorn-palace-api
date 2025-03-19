import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { bookingProviders } from './booking.providers/booking.providers';
import { DatabaseModule } from '../../database/database.module';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [DatabaseModule, ShowtimesModule],
  controllers: [BookingsController],
  providers: [...bookingProviders, BookingsService],
})
export class BookingsModule {}
