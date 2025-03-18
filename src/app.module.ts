import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './modules/movies/movies.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [MoviesModule, ShowtimesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
