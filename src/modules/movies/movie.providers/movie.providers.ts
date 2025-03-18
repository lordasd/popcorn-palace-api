import { DataSource } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity/movie.entity';

export const movieProviders = [
  {
    provide: 'MOVIE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MovieEntity),
    inject: ['DATA_SOURCE'],
  },
];