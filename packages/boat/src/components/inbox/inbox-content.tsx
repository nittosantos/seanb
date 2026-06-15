'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import type { ChatMessage, ConversationSummary } from '@seanb/shared';
import ChatSidebar from '@/components/inbox/chat-sidebar';
import ChatHeader from '@/components/inbox/chat-header';
import ChatInput from '@/components/inbox/chat-input';
import ChatBox from '@/components/inbox/chat-box';
import Text from '@/components/ui/typography/text';
import useAuth from '@/hooks/use-auth';
import {
  joinConversation,
  sendChatMessage,
  useChatSocket,
} from '@/hooks/use-chat-socket';
import {
  fetchConversationMessages,
  fetchConversations,
  startListingChat,
} from '@/lib/conversations-api';
import { useRouter } from '@/i18n/navigation';

export default function InboxContent() {
  const t = useTranslations('inbox');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken, user, isAuthorized, isHydrating } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeConversationIdRef = useRef<string | null>(null);

  const conversationParam = searchParams.get('conversation');
  const listingParam = searchParams.get('listing');

  activeConversationIdRef.current = activeConversationId;

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const loadConversations = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const data = await fetchConversations(accessToken);
    setConversations(data);
    return data;
  }, [accessToken]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!accessToken) {
        return;
      }

      const data = await fetchConversationMessages(conversationId, accessToken);
      setMessages(data.messages);
      joinConversation(accessToken, conversationId);
    },
    [accessToken],
  );

  useChatSocket(accessToken, {
    onMessage: (message) => {
      if (message.conversationId !== activeConversationIdRef.current) {
        return;
      }

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) {
          return current;
        }

        return [...current, message];
      });
    },
    onConversationUpdated: (conversation) => {
      setConversations((current) => {
        const next = current.filter((item) => item.id !== conversation.id);
        return [conversation, ...next].sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return bTime - aTime;
        });
      });
    },
  });

  useEffect(() => {
    if (isHydrating || !isAuthorized || !accessToken) {
      return;
    }

    let cancelled = false;

    async function bootstrap() {
      setIsLoading(true);
      setError(null);

      try {
        if (listingParam) {
          const conversation = await startListingChat(listingParam, accessToken);
          if (cancelled) return;

          setConversations((current) => {
            const without = current.filter((item) => item.id !== conversation.id);
            return [conversation, ...without];
          });
          setActiveConversationId(conversation.id);
          await loadMessages(conversation.id);
          router.replace('/account/inbox?conversation=' + conversation.id);
          return;
        }

        const data = await loadConversations();
        if (cancelled) return;

        const initialId = conversationParam ?? data?.[0]?.id ?? null;

        setActiveConversationId(initialId);

        if (initialId) {
          await loadMessages(initialId);
        } else {
          setMessages([]);
        }
      } catch {
        if (!cancelled) {
          setError(t('loadError'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    conversationParam,
    isAuthorized,
    isHydrating,
    listingParam,
    loadConversations,
    loadMessages,
    router,
    t,
  ]);

  async function handleSelectConversation(conversationId: string) {
    setSidebarOpen(false);
    setActiveConversationId(conversationId);
    setMessages([]);

    try {
      await loadMessages(conversationId);
      router.replace('/account/inbox?conversation=' + conversationId);
    } catch {
      setError(t('loadError'));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!accessToken || !activeConversationId || !draft.trim() || isSending) {
      return;
    }

    const body = draft.trim();
    setDraft('');
    setIsSending(true);

    try {
      sendChatMessage(accessToken, activeConversationId, body);
    } catch {
      setDraft(body);
      setError(t('sendError'));
    } finally {
      setIsSending(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container-fluid w-full py-8 md:py-12 xl:py-16">
        <Text className="text-center text-gray">{t('loading')}</Text>
      </div>
    );
  }

  return (
    <div className="container-fluid w-full py-8 md:py-12 xl:py-16">
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="relative mx-auto grid min-h-[500px] w-full !max-w-7xl grid-cols-1 gap-0 overflow-hidden rounded-xl md:min-h-[600px] md:grid-cols-[200px_auto] md:shadow-card xl:grid-cols-[250px_auto] 3xl:grid-cols-[300px_auto]">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={activeConversationId}
          className={clsx(
            'absolute inset-0 z-10 opacity-100 transition-all duration-500 md:static',
            sidebarOpen &&
              'translate-y-full opacity-50 md:translate-y-0 md:opacity-100',
          )}
          activeChatClassName="bg-white"
          onClick={handleSelectConversation}
        />
        <div className="flex flex-col pb-2 md:px-5 ">
          <ChatHeader
            conversation={activeConversation}
            onClick={() => setSidebarOpen((current) => !current)}
          />
          {activeConversation ? (
            <>
              <ChatBox messages={messages} currentUserId={user?.id} />
              <ChatInput
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onSubmit={handleSubmit}
                disabled={isSending}
              />
            </>
          ) : (
            <Text className="flex flex-grow items-center justify-center py-16 text-center text-gray">
              {t('selectConversation')}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}
