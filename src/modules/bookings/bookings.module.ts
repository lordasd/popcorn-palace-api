import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEntity } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), ShowtimesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
