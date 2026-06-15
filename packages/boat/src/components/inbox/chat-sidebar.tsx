'use client';

import type { ConversationSummary } from '@seanb/shared';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Input from '@/components/ui/form-fields/input';
import Text from '@/components/ui/typography/text';
import Avatar from '@/components/ui/avatar';

interface Props {
  conversations: ConversationSummary[];
  onClick?: (conversationId: string) => void;
  activeChatClassName?: string;
  currentConversationId?: string | null;
  className?: string;
}

export default function ChatSidebar({
  onClick,
  activeChatClassName,
  currentConversationId,
  conversations,
  className,
}: Props) {
  const t = useTranslations('inbox');
  const [searchfilter, setSearchFilter] = useState('');

  const filtered = useMemo(
    () =>
      conversations.filter((item) => {
        const query = searchfilter.toLowerCase();
        return (
          item.otherParticipant.name.toLowerCase().includes(query) ||
          item.listing.title.toLowerCase().includes(query)
        );
      }),
    [conversations, searchfilter],
  );

  return (
    <div className={clsx('overflow-y-auto bg-gray-lightest', className)}>
      <div className="p-5">
        <Input
          type="text"
          size="DEFAULT"
          placeholder={t('searchByName')}
          startIcon={<MagnifyingGlassIcon className="h-auto w-4" />}
          value={searchfilter}
          className="rounded-lg bg-white"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>
      <div>
        {filtered.length === 0 ? (
          <Text className="px-5 py-8 text-center text-sm text-gray">
            {t('emptyConversations')}
          </Text>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onClick?.(item.id)}
              className={clsx(
                'flex cursor-pointer items-center py-3 px-5 hover:bg-white',
                item.id === currentConversationId && activeChatClassName,
              )}
            >
              <Avatar
                src={item.otherParticipant.avatar ?? undefined}
                name={item.otherParticipant.name}
                size="40"
              />
              <div className="ml-3 min-w-0 flex-1 rtl:ml-0 rtl:mr-3">
                <Text className="truncate text-sm font-medium text-gray-dark md:text-base">
                  {item.otherParticipant.name}
                </Text>
                <Text className="truncate text-xs text-gray md:text-sm">
                  {item.listing.title}
                </Text>
                {item.lastMessage && (
                  <Text className="truncate text-xs text-gray">
                    {item.lastMessage.body}
                  </Text>
                )}
              </div>
              {item.unreadCount > 0 && (
                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-dark px-1 text-xs text-white">
                  {item.unreadCount}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
