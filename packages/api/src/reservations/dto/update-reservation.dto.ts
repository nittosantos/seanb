import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../../../generated/prisma/client';

export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
