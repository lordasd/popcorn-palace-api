import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { ShowtimeProviders } from './showtime.providers/showtime.providers';

@Module({
  controllers: [ShowtimesController],
  providers: [ShowtimesService, ShowtimeProviders]
})
export class ShowtimesModule {}
