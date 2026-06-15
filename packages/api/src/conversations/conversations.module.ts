import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-change-in-production',
    }),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ChatGateway],
  exports: [ConversationsService, ChatGateway],
})
export class ConversationsModule {}
