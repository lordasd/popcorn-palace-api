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
  @Min(0)
  price: number;

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
  @IsAfterDate('startTime')
  endTime: Date;
}
