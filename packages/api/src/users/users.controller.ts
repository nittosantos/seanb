import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  changePasswordSchema,
  updateProfileSchema,
  type ChangePasswordInput,
  type UpdateProfileInput,
} from '@seanb/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody } from '../common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: string,
    @ZodBody(updateProfileSchema) dto: UpdateProfileInput,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('me/password')
  changePassword(
    @CurrentUser('id') userId: string,
    @ZodBody(changePasswordSchema) dto: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(userId, dto);
  }

  @Get('me/dashboard')
  getDashboard(@CurrentUser('id') userId: string) {
    return this.usersService.getDashboardStats(userId);
  }
}
