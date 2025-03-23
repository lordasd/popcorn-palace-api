import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @IsPositive()
  showtimeId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1, { message: 'Seat number must be a positive integer' })
  seatNumber: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
