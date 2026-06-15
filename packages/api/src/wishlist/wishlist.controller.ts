import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('ids')
  findIds(@CurrentUser('id') userId: string) {
    return this.wishlistService.findIds(userId);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.wishlistService.findAll(userId);
  }

  @Post(':listingId')
  add(
    @CurrentUser('id') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.wishlistService.add(userId, listingId);
  }

  @Delete(':listingId')
  remove(
    @CurrentUser('id') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.wishlistService.remove(userId, listingId);
  }
}
