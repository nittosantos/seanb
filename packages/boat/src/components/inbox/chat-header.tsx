'use client';

import type { ConversationSummary } from '@seanb/shared';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import Text from '@/components/ui/typography/text';
import Avatar from '@/components/ui/avatar';

interface ChatHeaderProps {
  conversation: ConversationSummary | null;
  onClick?: () => void;
}

export default function ChatHeader({ conversation, onClick }: ChatHeaderProps) {
  if (!conversation) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-lighter py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onClick} className="mr-3 md:hidden">
          <ChevronLeftIcon className="h-auto w-4" />
        </button>
        <Avatar
          src={conversation.otherParticipant.avatar ?? undefined}
          name={conversation.otherParticipant.name}
          size="40"
        />
        <div className="min-w-0">
          <Text className="truncate text-sm font-medium text-gray-dark md:text-base">
            {conversation.otherParticipant.name}
          </Text>
          <Text className="truncate text-xs text-gray md:text-sm">
            {conversation.listing.title}
          </Text>
        </div>
      </div>
    </div>
  );
}
