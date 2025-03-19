import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { bookingProviders } from './booking.providers/booking.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookingsController],
  providers: [...bookingProviders, BookingsService],
})
export class BookingsModule {}
