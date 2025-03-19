import { DataSource } from 'typeorm';
import { BookingEntity } from '../entities/booking.entity';

export const bookingProviders = [
  {
    provide: 'BOOKING_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(BookingEntity),
    inject: ['DATA_SOURCE'],
  },
];
