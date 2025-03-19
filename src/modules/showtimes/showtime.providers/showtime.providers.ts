import { DataSource } from 'typeorm';
import { ShowtimeEntity } from '../entities/showtime.entity';

export const showtimeProviders = [
  {
    provide: 'SHOWTIME_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ShowtimeEntity),
    inject: ['DATA_SOURCE'],
  },
];
