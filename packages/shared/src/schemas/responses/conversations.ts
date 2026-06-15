import { z } from 'zod';
import { messageTypeSchema } from '../conversations';

export const chatParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable(),
});

export type ChatParticipant = z.infer<typeof chatParticipantSchema>;

export const conversationListingSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  image: z.string().nullable(),
});

export type ConversationListing = z.infer<typeof conversationListingSchema>;

export const conversationLastMessageSchema = z.object({
  id: z.string(),
  body: z.string(),
  type: messageTypeSchema,
  senderId: z.string(),
  createdAt: z.string(),
});

export type ConversationLastMessage = z.infer<
  typeof conversationLastMessageSchema
>;

export const conversationSummarySchema = z.object({
  id: z.string(),
  listing: conversationListingSchema,
  otherParticipant: chatParticipantSchema,
  lastMessage: conversationLastMessageSchema.nullable(),
  unreadCount: z.number(),
  updatedAt: z.string().nullable(),
});

export type ConversationSummary = z.infer<typeof conversationSummarySchema>;

export const conversationListSchema = z.array(conversationSummarySchema);

export type ConversationList = z.infer<typeof conversationListSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  type: messageTypeSchema,
  body: z.string(),
  mediaUrl: z.string().nullable(),
  mediaMimeType: z.string().nullable(),
  mediaSize: z.number().nullable(),
  createdAt: z.string(),
  readAt: z.string().nullable(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const conversationMessagesSchema = z.object({
  messages: z.array(chatMessageSchema),
});

export type ConversationMessages = z.infer<typeof conversationMessagesSchema>;

export const chatMessageEventSchema = chatMessageSchema;
export const conversationUpdatedEventSchema = conversationSummarySchema;
