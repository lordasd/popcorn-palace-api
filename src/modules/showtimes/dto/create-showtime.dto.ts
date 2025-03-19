import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  @ValidateIf((o) => o.startTime)
  endTime: Date;

  @IsNumber()
  @Min(0)
  price: number;

  validate() {
    if (this.startTime && this.endTime && this.startTime >= this.endTime)
      throw new Error('End time must be greater than start time');
  }
}
