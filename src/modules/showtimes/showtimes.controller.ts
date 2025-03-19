import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  findOne(@Param('showtimeId') showtimeId: number): Promise<ShowtimeEntity> {
    return this.showtimeService.findOne(showtimeId);
  }

  @Post()
  create(
    @Body() createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeEntity> {
    try {
      createShowtimeDto.validate();
      return this.showtimeService.create(createShowtimeDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/update/:showtimeId')
  update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<void> {
    return this.showtimeService.update(showtimeId, updateShowtimeDto);
  }

  @Delete(':showtimeId')
  delete(@Param('showtimeId') showtimeId: number) {
    return this.showtimeService.delete(showtimeId);
  }
}
