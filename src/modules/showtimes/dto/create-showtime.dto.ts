import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfterDate } from './date-validation.decorator';

export class CreateShowtimeDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @ValidateIf((o) => !!o.startTime)
  @Type(() => Date)
  @IsAfterDate('startTime', { message: 'End time must be after start time' })
  endTime: Date;

  @IsNumber()
  @Min(0)
  price: number;
}
