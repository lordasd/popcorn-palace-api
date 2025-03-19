import { DataSource } from 'typeorm';
import { MovieEntity } from '../../modules/movies/entities/movie.entity';
import { ShowtimeEntity } from '../../modules/showtimes/entities/showtime.entity';
import { BookingEntity } from '../../modules/bookings/entities/booking.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'popcorn-palace',
        password: 'popcorn-palace',
        database: 'popcorn-palace',
        entities: [MovieEntity, ShowtimeEntity, BookingEntity],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
