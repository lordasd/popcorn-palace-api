import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('MOVIE_REPOSITORY')
    private movieRepository: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    return this.movieRepository.find();
  }

  async findByTitle(title: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({ where: { title } });
    if (!movie)
      throw new NotFoundException(`Movie with title ${title} not found`);
    return movie;
  }

  async findById(id: number): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const existingMovie = await this.movieRepository.findOne({
      where: { title: createMovieDto.title },
    });

    if (existingMovie)
      throw new ConflictException(
        `Movie with title ${createMovieDto.title} already exists`,
      );

    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async update(title: string, updateMovieDto: UpdateMovieDto): Promise<void> {
    const existingMovie = await this.findByTitle(title);
    if (!existingMovie) throw new NotFoundException(`Movie with title ${title} not found`);
    this.movieRepository.merge(existingMovie, updateMovieDto);
    await this.movieRepository.save(existingMovie);
  }

  async remove(title: string): Promise<void> {
    const existingMovie = await this.findByTitle(title);
    await this.movieRepository.remove(existingMovie);
  }
}
