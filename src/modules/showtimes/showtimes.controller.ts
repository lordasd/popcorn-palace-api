import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ShowtimeEntity } from './entities/showtime.entity';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimeService: ShowtimesService) {}

  @Get(':showtimeId')
  async findOne(
    @Param('showtimeId') showtimeId: number,
  ): Promise<ShowtimeEntity> {
    return this.showtimeService.findOne(showtimeId);
  }

  @Post()
  async create(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeEntity> {
    return this.showtimeService.create(createShowtimeDto);
  }

  @Post('/update/:showtimeId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<void> {
    return this.showtimeService.update(showtimeId, updateShowtimeDto);
  }

  @Delete(':showtimeId')
  async delete(@Param('showtimeId') showtimeId: number) {
    return this.showtimeService.delete(showtimeId);
  }
}
