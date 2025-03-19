import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  showtimeId: number;

  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
