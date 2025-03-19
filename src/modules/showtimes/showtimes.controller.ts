import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimeEntity } from './entities/showtime.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get(':showtimeId')
  async findOne(
    @Param('shotimeId') showtimeId: number,
  ): Promise<ShowtimeEntity> {

  }

  @Post()
  async create(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeEntity> {

  }

  @Post('/update/:showtimeId')
  async update(
    @Param('shotimeId') showtimeId: number,
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<void> {
    
  }

  @Delete(':showtimeId')
  async delete(@Param('showtimeId') showtimeId: number) {
    
  }
}
