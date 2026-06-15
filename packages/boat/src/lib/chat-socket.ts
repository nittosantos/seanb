'use client';

import { io, type Socket } from 'socket.io-client';
import type {
  ChatMessage,
  ConversationSummary,
} from '@seanb/shared';
import {
  chatMessageEventSchema,
  conversationUpdatedEventSchema,
} from '@seanb/shared';
import { parseResponse } from '@seanb/shared';
import { CHAT_SOCKET_URL } from '@/config/chat';

type ChatSocketHandlers = {
  onMessage?: (message: ChatMessage) => void;
  onConversationUpdated?: (conversation: ConversationSummary) => void;
  onError?: (message: string) => void;
};

let sharedSocket: Socket | null = null;
let sharedToken: string | null = null;

export function getChatSocket(token: string) {
  if (sharedSocket && sharedToken === token) {
    return sharedSocket;
  }

  if (sharedSocket) {
    sharedSocket.disconnect();
  }

  sharedSocket = io(`${CHAT_SOCKET_URL}/chat`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  sharedToken = token;

  return sharedSocket;
}

export function disconnectChatSocket() {
  sharedSocket?.disconnect();
  sharedSocket = null;
  sharedToken = null;
}

export function subscribeChatSocket(
  token: string,
  handlers: ChatSocketHandlers,
) {
  const socket = getChatSocket(token);

  function handleMessage(payload: unknown) {
    const message = parseResponse(chatMessageEventSchema, payload);
    handlers.onMessage?.(message);
  }

  function handleConversationUpdated(payload: unknown) {
    const conversation = parseResponse(
      conversationUpdatedEventSchema,
      payload,
    );
    handlers.onConversationUpdated?.(conversation);
  }

  function handleError(payload: { message?: string }) {
    handlers.onError?.(payload.message ?? 'Chat error');
  }

  socket.on('message', handleMessage);
  socket.on('conversationUpdated', handleConversationUpdated);
  socket.on('error', handleError);

  return () => {
    socket.off('message', handleMessage);
    socket.off('conversationUpdated', handleConversationUpdated);
    socket.off('error', handleError);
  };
}

export function joinConversation(token: string, conversationId: string) {
  const socket = getChatSocket(token);
  socket.emit('joinConversation', { conversationId });
}

export function sendChatMessage(
  token: string,
  conversationId: string,
  body: string,
) {
  const socket = getChatSocket(token);
  socket.emit('sendMessage', {
    conversationId,
    body,
    type: 'TEXT',
  });
}
