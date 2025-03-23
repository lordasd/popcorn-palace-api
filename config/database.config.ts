import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MovieEntity } from '../src/modules/movies/entities/movie.entity';
import { ShowtimeEntity } from '../src/modules/showtimes/entities/showtime.entity';
import { BookingEntity } from '../src/modules/bookings/entities/booking.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'popcorn-palace',
  password: process.env.DB_PASSWORD || 'popcorn-palace',
  database: process.env.DB_DATABASE || 'popcorn-palace',
  entities: [MovieEntity, ShowtimeEntity, BookingEntity],
  synchronize: process.env.NODE_ENV !== 'production',
};
