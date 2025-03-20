import { ShowtimeEntity } from '../entities/showtime.entity';

export const mockShowtimes: ShowtimeEntity[] = [
  {
    id: 1,
    movieId: 1,
    theater: 'IMAX Theater A',
    startTime: new Date('2024-03-20T14:00:00'),
    endTime: new Date('2024-03-20T16:30:00'),
    price: 15.99,
  },
  {
    id: 2,
    movieId: 2,
    theater: 'Dolby Cinema',
    startTime: new Date('2024-03-21T18:00:00'),
    endTime: new Date('2024-03-21T21:00:00'),
    price: 17.99,
  },
  {
    id: 3,
    movieId: 3,
    theater: 'Classic Theater B',
    startTime: new Date('2024-03-22T20:00:00'),
    endTime: new Date('2024-03-22T22:30:00'),
    price: 12.5,
  },
  {
    id: 4,
    movieId: 4,
    theater: 'IMAX Theater A',
    startTime: new Date('2024-03-23T16:00:00'),
    endTime: new Date('2024-03-23T18:15:00'),
    price: 14.0,
  },
  {
    id: 5,
    movieId: 5,
    theater: 'Dolby Cinema',
    startTime: new Date('2024-03-24T19:30:00'),
    endTime: new Date('2024-03-24T22:30:00'),
    price: 19.99,
  },
];
