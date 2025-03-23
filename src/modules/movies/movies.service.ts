import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { MovieEntity } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly moviesRepository: Repository<MovieEntity>,
  ) {}

  async findAll(): Promise<MovieEntity[]> {
    return this.moviesRepository.find();
  }

  async findByTitle(title: string): Promise<MovieEntity> {
    const movie = await this.moviesRepository.findOne({ where: { title } });
    if (!movie)
      throw new NotFoundException(`Movie with title ${title} not found`);
    return movie;
  }

  async findById(id: number): Promise<MovieEntity> {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie with ID ${id} not found`);
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    const existingMovie = await this.moviesRepository.findOne({
      where: { title: createMovieDto.title },
    });

    if (existingMovie)
      throw new ConflictException(
        `Movie with title ${createMovieDto.title} already exists`,
      );

    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async update(title: string, updateMovieDto: UpdateMovieDto): Promise<void> {
    const existingMovie = await this.findByTitle(title);
    this.moviesRepository.merge(existingMovie, updateMovieDto);
    await this.moviesRepository.save(existingMovie);
  }

  async remove(title: string): Promise<void> {
    const existingMovie = await this.findByTitle(title);
    await this.moviesRepository.remove(existingMovie);
  }
}
