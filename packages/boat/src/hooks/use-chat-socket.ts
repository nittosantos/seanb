'use client';

import { useEffect, useRef } from 'react';
import {
  joinConversation,
  sendChatMessage,
  subscribeChatSocket,
} from '@/lib/chat-socket';

type ChatSocketHandlers = {
  onMessage?: Parameters<typeof subscribeChatSocket>[1]['onMessage'];
  onConversationUpdated?: Parameters<
    typeof subscribeChatSocket
  >[1]['onConversationUpdated'];
  onError?: Parameters<typeof subscribeChatSocket>[1]['onError'];
};

export function useChatSocket(
  token: string | null,
  handlers: ChatSocketHandlers,
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!token) {
      return;
    }

    return subscribeChatSocket(token, {
      onMessage: (message) => handlersRef.current.onMessage?.(message),
      onConversationUpdated: (conversation) =>
        handlersRef.current.onConversationUpdated?.(conversation),
      onError: (message) => handlersRef.current.onError?.(message),
    });
  }, [token]);
}

export { joinConversation, sendChatMessage };
