import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
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
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboard(@CurrentUser('id') userId: string) {
    return this.usersService.getDashboardStats(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser('id') userId: string,
    @ZodBody(changePasswordSchema) dto: ChangePasswordInput,
  ) {
    return this.usersService.changePassword(userId, dto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser('id') userId: string,
    @ZodBody(updateProfileSchema) dto: UpdateProfileInput,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Get(':identifier')
  getPublicProfile(@Param('identifier') identifier: string) {
    return this.usersService.getPublicProfile(identifier);
  }
}
