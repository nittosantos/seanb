import { Type } from 'class-transformer';
import { IsDateString, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  listingId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;
}
