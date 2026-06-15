import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ListingsModule } from './listings/listings.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [PrismaModule, AuthModule, ListingsModule, ReservationsModule, UsersModule, WishlistModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
