import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  wsJoinConversationSchema,
  wsSendMessageSchema,
  type ChatMessage,
} from '@seanb/shared';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationsService } from './conversations.service';

type SocketUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
};

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly conversationsService: ConversationsService,
  ) {}

  async handleConnection(client: Socket) {
    const user = await this.authenticateClient(client);

    if (!user) {
      client.disconnect(true);
      return;
    }

    client.data.user = user;
    await client.join(`user:${user.id}`);
    this.logger.debug(`Client connected: ${user.id}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user as SocketUser | undefined;

    if (user) {
      this.logger.debug(`Client disconnected: ${user.id}`);
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: unknown,
  ) {
    const user = this.getSocketUser(client);
    const parsed = wsJoinConversationSchema.safeParse(payload);

    if (!parsed.success) {
      client.emit('error', { message: 'Invalid join payload' });
      return;
    }

    try {
      await this.conversationsService.assertParticipant(
        parsed.data.conversationId,
        user.id,
      );
      await client.join(`conversation:${parsed.data.conversationId}`);
      await this.conversationsService.markAsRead(
        parsed.data.conversationId,
        user.id,
      );
      client.emit('joinedConversation', { conversationId: parsed.data.conversationId });
    } catch (error) {
      client.emit('error', {
        message: error instanceof Error ? error.message : 'Unable to join conversation',
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: unknown,
  ) {
    const user = this.getSocketUser(client);
    const parsed = wsSendMessageSchema.safeParse(payload);

    if (!parsed.success) {
      client.emit('error', { message: 'Invalid message payload' });
      return;
    }

    try {
      const message = await this.conversationsService.sendMessage(
        parsed.data.conversationId,
        user.id,
        {
          body: parsed.data.body,
          type: parsed.data.type,
        },
      );

      const conversation = await this.conversationsService.assertParticipant(
        parsed.data.conversationId,
        user.id,
      );

      await this.broadcastMessage(
        message,
        conversation.guestId,
        conversation.hostId,
      );
    } catch (error) {
      client.emit('error', {
        message: error instanceof Error ? error.message : 'Unable to send message',
      });
    }
  }

  async broadcastMessage(message: ChatMessage, guestId: string, hostId: string) {
    this.server.to(`conversation:${message.conversationId}`).emit('message', message);

    const [guestSummary, hostSummary] = await Promise.all([
      this.conversationsService.getConversationSummary(message.conversationId, guestId),
      this.conversationsService.getConversationSummary(message.conversationId, hostId),
    ]);

    this.server.to(`user:${guestId}`).emit('conversationUpdated', guestSummary);
    this.server.to(`user:${hostId}`).emit('conversationUpdated', hostSummary);
  }

  private getSocketUser(client: Socket): SocketUser {
    const user = client.data.user as SocketUser | undefined;

    if (!user) {
      throw new Error('Unauthorized socket connection');
    }

    return user;
  }

  private async authenticateClient(client: Socket): Promise<SocketUser | null> {
    const token = this.extractToken(client);

    if (!token) {
      return null;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      });

      return user;
    } catch {
      return null;
    }
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === 'string' && authToken.length > 0) {
      return authToken;
    }

    const authorization = client.handshake.headers.authorization;

    if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length);
    }

    return null;
  }
}
