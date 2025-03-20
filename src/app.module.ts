import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './modules/movies/entities/movie.entity';
import { ShowtimeEntity } from './modules/showtimes/entities/showtime.entity';
import { BookingEntity } from './modules/bookings/entities/booking.entity';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [MovieEntity, ShowtimeEntity, BookingEntity],
      synchronize: true,
    }),
    MoviesModule,
    ShowtimesModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
