import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { MoviesModule } from '../movies/movies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeEntity } from './entities/showtime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShowtimeEntity]), MoviesModule],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
  exports: [ShowtimesService],
})
export class ShowtimesModule {}
