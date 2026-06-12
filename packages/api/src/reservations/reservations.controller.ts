import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../../generated/prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';

type AuthUser = {
  id: string;
  role: UserRole;
};

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findMineAsGuest(@CurrentUser('id') userId: string) {
    return this.reservationsService.findMineAsGuest(userId);
  }

  @Get('host')
  findMineAsHost(@CurrentUser('id') userId: string) {
    return this.reservationsService.findMineAsHost(userId);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(userId, dto);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationsService.updateStatus(
      id,
      user.id,
      user.role,
      dto,
    );
  }
}
