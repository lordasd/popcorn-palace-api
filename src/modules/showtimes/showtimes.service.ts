import { Inject, Injectable } from '@nestjs/common';
import { ShowtimeEntity } from './entities/showtime.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShowtimesService {
  constructor(
    @Inject('SHOWTIME_REPOSITORY')
    private showtimeRepository: Repository<ShowtimeEntity>,
  ) {}

  async findOne(showtimeId: string)
}
