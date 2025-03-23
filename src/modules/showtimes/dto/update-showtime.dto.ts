import { CreateShowtimeDto } from './create-showtime.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
