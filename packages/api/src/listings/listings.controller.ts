import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  createListingSchema,
  createReviewSchema,
  queryListingsSchema,
  updateListingSchema,
  type CreateListingInput,
  type CreateReviewInput,
  type QueryListingsInput,
  type UpdateListingInput,
  type UserRole,
} from '@seanb/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ZodBody, ZodQuery } from '../common/pipes/zod-validation.pipe';
import { ListingsService } from './listings.service';

type AuthUser = {
  id: string;
  role: UserRole;
};

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(@ZodQuery(queryListingsSchema) query: QueryListingsInput) {
    return this.listingsService.findAll(query);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser('id') userId: string) {
    return this.listingsService.findMine(userId);
  }

  @Get(':slug/booked-dates')
  getBookedDates(@Param('slug') slug: string) {
    return this.listingsService.getBookedDates(slug);
  }

  @Post(':slug/reviews')
  @UseGuards(JwtAuthGuard)
  createReview(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
    @ZodBody(createReviewSchema) dto: CreateReviewInput,
  ) {
    return this.listingsService.createReview(slug, userId, dto);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.listingsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: AuthUser,
    @ZodBody(createListingSchema) dto: CreateListingInput,
  ) {
    return this.listingsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @ZodBody(updateListingSchema) dto: UpdateListingInput,
  ) {
    return this.listingsService.update(id, user.id, user.role, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.listingsService.remove(id, user.id, user.role);
  }
}
