import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { movieProviders } from './movie.providers/movie.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MoviesController],
  providers: [...movieProviders, MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
