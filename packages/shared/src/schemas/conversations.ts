import { z } from 'zod';

export const messageTypeSchema = z.enum(['TEXT', 'IMAGE', 'VIDEO']);
export type MessageType = z.infer<typeof messageTypeSchema>;

export const createConversationSchema = z.object({
  listingId: z.string().min(1),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(5000),
  type: messageTypeSchema.default('TEXT'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const queryConversationMessagesSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  before: z.string().optional(),
});

export type QueryConversationMessagesInput = z.infer<
  typeof queryConversationMessagesSchema
>;

export const wsJoinConversationSchema = z.object({
  conversationId: z.string().min(1),
});

export const wsSendMessageSchema = sendMessageSchema.extend({
  conversationId: z.string().min(1),
});

export type WsSendMessageInput = z.infer<typeof wsSendMessageSchema>;
