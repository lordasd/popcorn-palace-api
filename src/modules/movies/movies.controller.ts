import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieEntity } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('all')
  async findAll(): Promise<MovieEntity[]> {
    return this.moviesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    return this.moviesService.create(createMovieDto);
  }

  @Post('update/:movieTitle')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('movieTitle') movieTitle: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<void> {
    return this.moviesService.update(movieTitle, updateMovieDto);
  }

  @Delete(':movieTitle')
  async remove(@Param('movieTitle') movieTitle: string): Promise<void> {
    return this.moviesService.remove(movieTitle);
  }
}
