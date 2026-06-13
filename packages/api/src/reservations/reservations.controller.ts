import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  createReservationSchema,
  updateReservationSchema,
  type CreateReservationInput,
  type UpdateReservationInput,
  type UserRole,
} from '@seanb/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/pipes/zod-validation.pipe';
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
  create(
    @CurrentUser('id') userId: string,
    @ZodBody(createReservationSchema) dto: CreateReservationInput,
  ) {
    return this.reservationsService.create(userId, dto);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @ZodBody(updateReservationSchema) dto: UpdateReservationInput,
  ) {
    return this.reservationsService.updateStatus(
      id,
      user.id,
      user.role,
      dto,
    );
  }
}
