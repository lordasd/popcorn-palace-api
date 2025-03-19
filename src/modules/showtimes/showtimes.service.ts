import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShowtimeEntity } from './entities/showtime.entity';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @Inject('SHOWTIME_REPOSITORY')
    private showtimeRepository: Repository<ShowtimeEntity>,
    private moviesService: MoviesService,
  ) {}

  async findOne(showtimeId: number): Promise<ShowtimeEntity> {
    const show = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });

    if (!show)
      throw new NotFoundException(`Showtime with ID ${showtimeId} not found`);
    return show;
  }

  async create(createShowtimeDto: CreateShowtimeDto): Promise<ShowtimeEntity> {
    await this.moviesService.findById(createShowtimeDto.movieId);

    await this.isOverlappingShowtimes(
      createShowtimeDto.theater,
      createShowtimeDto.startTime,
      createShowtimeDto.endTime,
      null, // No showtime to exclude
    );

    const show = this.showtimeRepository.create(createShowtimeDto);
    return await this.showtimeRepository.save(show);
  }

  async update(
    showtimeId: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<void> {
    const existingShow = await this.findOne(showtimeId);
    // If movieId is provided, check if movie exists
    if (updateShowtimeDto.movieId)
      await this.moviesService.findById(updateShowtimeDto.movieId);

    if (
      updateShowtimeDto.startTime ||
      updateShowtimeDto.endTime ||
      updateShowtimeDto.theater
    ) {
      const theater = updateShowtimeDto.theater || existingShow.theater;
      const startTime = updateShowtimeDto.startTime || existingShow.startTime;
      const endTime = updateShowtimeDto.endTime || existingShow.endTime;

      await this.isOverlappingShowtimes(
        theater,
        startTime,
        endTime,
        showtimeId, // Exclude this showtime from the overlap check
      );
    }

    this.showtimeRepository.merge(existingShow, updateShowtimeDto);
    await this.showtimeRepository.save(existingShow);
  }

  async delete(showtimeId: number): Promise<void> {
    const existingShow = await this.findOne(showtimeId);
    if (!existingShow) throw new NotFoundException('Show not found');
    await this.showtimeRepository.remove(existingShow);
  }

  private async isOverlappingShowtimes(
    theater: string,
    startTime: Date,
    endTime: Date,
    excludeId: number | null,
  ): Promise<void> {
    const queryBuilder = this.showtimeRepository
      .createQueryBuilder('showtimes')
      .where('showtimes.theater = :theater', { theater })
      .andWhere(
        'showtimes.startTime <= :endTime AND showtimes.endTime >= :startTime',
        { startTime, endTime },
      );

    if (excludeId)
      queryBuilder.andWhere('showtimes.id != :excludeId', { excludeId });

    const count = await queryBuilder.getCount();
    if (count > 0)
      throw new BadRequestException(
        'Show time overlaps with another show time',
      );
  }
}
