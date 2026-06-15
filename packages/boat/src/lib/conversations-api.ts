import { API_ENDPOINTS } from '@/config/api-endpoints';
import { apiFetch } from '@/lib/api-client';
import type {
  ChatMessage,
  ConversationList,
  ConversationMessages,
  ConversationSummary,
  CreateConversationInput,
  SendMessageInput,
} from '@seanb/shared';
import {
  chatMessageSchema,
  conversationListSchema,
  conversationMessagesSchema,
  conversationSummarySchema,
} from '@seanb/shared';

export async function fetchConversations(
  token: string,
): Promise<ConversationList> {
  return apiFetch<ConversationList>(API_ENDPOINTS.CONVERSATIONS, {
    token,
    schema: conversationListSchema,
  });
}

export async function createOrGetConversation(
  input: CreateConversationInput,
  token: string,
): Promise<ConversationSummary> {
  return apiFetch<ConversationSummary>(API_ENDPOINTS.CONVERSATIONS, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
    schema: conversationSummarySchema,
  });
}

export async function fetchConversationMessages(
  conversationId: string,
  token: string,
): Promise<ConversationMessages> {
  return apiFetch<ConversationMessages>(
    API_ENDPOINTS.CONVERSATION_MESSAGES(conversationId),
    {
      token,
      schema: conversationMessagesSchema,
    },
  );
}

export async function sendConversationMessage(
  conversationId: string,
  input: SendMessageInput,
  token: string,
): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(
    API_ENDPOINTS.CONVERSATION_MESSAGES(conversationId),
    {
      method: 'POST',
      token,
      body: JSON.stringify(input),
      schema: chatMessageSchema,
    },
  );
}

export async function startListingChat(
  listingId: string,
  token: string,
  initialMessage?: string,
): Promise<ConversationSummary> {
  const conversation = await createOrGetConversation({ listingId }, token);

  if (initialMessage?.trim()) {
    await sendConversationMessage(
      conversation.id,
      { body: initialMessage.trim(), type: 'TEXT' },
      token,
    );
  }

  return conversation;
}
