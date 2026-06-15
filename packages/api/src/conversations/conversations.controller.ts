import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  createConversationSchema,
  queryConversationMessagesSchema,
  sendMessageSchema,
  type CreateConversationInput,
  type QueryConversationMessagesInput,
  type SendMessageInput,
} from '@seanb/shared';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodBody, ZodQuery } from '../common/pipes/zod-validation.pipe';
import { ConversationsService } from './conversations.service';
import { ChatGateway } from './chat.gateway';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Post()
  createOrGet(
    @CurrentUser('id') userId: string,
    @ZodBody(createConversationSchema) dto: CreateConversationInput,
  ) {
    return this.conversationsService.createOrGet(userId, dto);
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @ZodQuery(queryConversationMessagesSchema) query: QueryConversationMessagesInput,
  ) {
    return this.conversationsService.getMessages(conversationId, userId, query);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @CurrentUser('id') userId: string,
    @ZodBody(sendMessageSchema) dto: SendMessageInput,
  ) {
    const message = await this.conversationsService.sendMessage(
      conversationId,
      userId,
      dto,
    );

    const conversation = await this.conversationsService.assertParticipant(
      conversationId,
      userId,
    );

    await this.chatGateway.broadcastMessage(
      message,
      conversation.guestId,
      conversation.hostId,
    );

    return message;
  }
}
