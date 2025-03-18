import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { databaseProviders } from './database/database.providers/database.providers';
import { movieProviders } from './modules/movies/movie.providers/movie.providers';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [MoviesModule, ShowtimesModule, BookingsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders, ...movieProviders],
})
export class AppModule {}
