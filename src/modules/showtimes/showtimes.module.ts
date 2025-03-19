import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { showtimeProviders } from './showtime.providers/showtime.providers';
import { DatabaseModule } from '../../database/database.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [DatabaseModule, MoviesModule],
  controllers: [ShowtimesController],
  providers: [...showtimeProviders, ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
