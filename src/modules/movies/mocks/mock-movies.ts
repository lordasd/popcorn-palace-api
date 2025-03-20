import { MovieEntity } from '../entities/movie.entity';

export const mockMovies: MovieEntity[] = [
  {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 148,
    rating: 8.8,
    releaseYear: 2010,
  },
  {
    id: 2,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    duration: 169,
    rating: 8.6,
    releaseYear: 2014,
  },
  {
    id: 3,
    title: 'The Dark Knight',
    genre: 'Action',
    duration: 152,
    rating: 9.0,
    releaseYear: 2008,
  },
  {
    id: 4,
    title: 'Parasite',
    genre: 'Thriller',
    duration: 132,
    rating: 8.6,
    releaseYear: 2019,
  },
  {
    id: 5,
    title: 'Avengers: Endgame',
    genre: 'Superhero',
    duration: 181,
    rating: 8.4,
    releaseYear: 2019,
  },
];
