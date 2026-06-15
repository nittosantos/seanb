import type {
  ConversationSummary,
  ChatMessage,
  MessageType,
} from '@seanb/shared';

type ConversationRow = {
  id: string;
  guestId: string;
  hostId: string;
  lastMessageAt: Date | null;
  updatedAt: Date;
  listing: {
    id: string;
    slug: string;
    title: string;
    images: string[];
  };
  guest: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  host: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  messages: Array<{
    id: string;
    body: string;
    type: MessageType;
    senderId: string;
    createdAt: Date;
  }>;
};

type MessageRow = {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  body: string;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaSize: number | null;
  createdAt: Date;
  readAt: Date | null;
};

export function mapConversationSummary(
  conversation: ConversationRow,
  viewerId: string,
  unreadCount: number,
): ConversationSummary {
  const isGuest = conversation.guestId === viewerId;
  const otherParticipant = isGuest ? conversation.host : conversation.guest;
  const lastMessage = conversation.messages[0] ?? null;

  return {
    id: conversation.id,
    listing: {
      id: conversation.listing.id,
      slug: conversation.listing.slug,
      title: conversation.listing.title,
      image: conversation.listing.images[0] ?? null,
    },
    otherParticipant: {
      id: otherParticipant.id,
      name: otherParticipant.name ?? 'User',
      avatar: otherParticipant.avatar,
    },
    lastMessage: lastMessage
      ? {
          id: lastMessage.id,
          body: lastMessage.body,
          type: lastMessage.type,
          senderId: lastMessage.senderId,
          createdAt: lastMessage.createdAt.toISOString(),
        }
      : null,
    unreadCount,
    updatedAt: (conversation.lastMessageAt ?? conversation.updatedAt).toISOString(),
  };
}

export function mapChatMessage(message: MessageRow): ChatMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    type: message.type,
    body: message.body,
    mediaUrl: message.mediaUrl,
    mediaMimeType: message.mediaMimeType,
    mediaSize: message.mediaSize,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
  };
}

export const conversationInclude = {
  listing: {
    select: {
      id: true,
      slug: true,
      title: true,
      images: true,
    },
  },
  guest: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  host: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  messages: {
    orderBy: { createdAt: 'desc' as const },
    take: 1,
    select: {
      id: true,
      body: true,
      type: true,
      senderId: true,
      createdAt: true,
    },
  },
} as const;
