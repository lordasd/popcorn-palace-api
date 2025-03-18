import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private movieRepository: Repository<MovieEntity>,
  ) {}

  findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find();
  }
}