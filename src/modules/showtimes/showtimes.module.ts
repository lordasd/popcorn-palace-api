import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { showtimeProviders } from './showtime.providers/showtime.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ShowtimesController],
  providers: [...showtimeProviders, ShowtimesService],
})
export class ShowtimesModule {}
