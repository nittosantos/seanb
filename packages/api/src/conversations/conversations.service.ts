import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateConversationInput,
  QueryConversationMessagesInput,
  SendMessageInput,
} from '@seanb/shared';
import { PrismaService } from '../prisma/prisma.service';
import {
  conversationInclude,
  mapChatMessage,
  mapConversationSummary,
} from './conversations.mapper';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ guestId: userId }, { hostId: userId }],
      },
      orderBy: [{ lastMessageAt: 'desc' }, { updatedAt: 'desc' }],
      include: conversationInclude,
    });

    const unreadCounts = await Promise.all(
      conversations.map((conversation) =>
        this.getUnreadCount(conversation.id, userId),
      ),
    );

    return conversations.map((conversation, index) =>
      mapConversationSummary(conversation, userId, unreadCounts[index]),
    );
  }

  async createOrGet(userId: string, dto: CreateConversationInput) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      select: { id: true, userId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.userId === userId) {
      throw new BadRequestException('You cannot start a chat on your own listing');
    }

    const existing = await this.prisma.conversation.findUnique({
      where: {
        listingId_guestId: {
          listingId: listing.id,
          guestId: userId,
        },
      },
      include: conversationInclude,
    });

    if (existing) {
      const unreadCount = await this.getUnreadCount(existing.id, userId);
      return mapConversationSummary(existing, userId, unreadCount);
    }

    const created = await this.prisma.conversation.create({
      data: {
        listingId: listing.id,
        guestId: userId,
        hostId: listing.userId,
      },
      include: conversationInclude,
    });

    return mapConversationSummary(created, userId, 0);
  }

  async getMessages(
    conversationId: string,
    userId: string,
    query: QueryConversationMessagesInput,
  ) {
    await this.assertParticipant(conversationId, userId);
    await this.markAsRead(conversationId, userId);

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(query.before
          ? { createdAt: { lt: new Date(query.before) } }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
    });

    return {
      messages: messages.reverse().map(mapChatMessage),
    };
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    dto: SendMessageInput,
  ) {
    await this.assertParticipant(conversationId, userId);

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          type: dto.type,
          body: dto.body,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: created.createdAt },
      });

      return created;
    });

    return mapChatMessage(message);
  }

  async linkInquiry(conversationId: string, inquiryId: string, userId: string) {
    await this.assertParticipant(conversationId, userId);

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { inquiryId },
    });
  }

  async assertParticipant(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { guestId: true, hostId: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.guestId !== userId && conversation.hostId !== userId) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    return conversation;
  }

  async getConversationSummary(conversationId: string, viewerId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: conversationInclude,
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation.guestId !== viewerId && conversation.hostId !== viewerId) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    const unreadCount = await this.getUnreadCount(conversationId, viewerId);
    return mapConversationSummary(conversation, viewerId, unreadCount);
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });
  }

  private async getUnreadCount(conversationId: string, userId: string) {
    return this.prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
    });
  }
}
