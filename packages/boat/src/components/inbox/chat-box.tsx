'use client';

import type { ChatMessage } from '@seanb/shared';
import clsx from 'clsx';

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUserId?: string | null;
}

export default function ChatBox({ messages, currentUserId }: ChatBoxProps) {
  return (
    <div className="max-h-[374px] flex-grow overflow-y-auto md:max-h-[478px]">
      {messages.map((item) => {
        const isOwn = item.senderId === currentUserId;

        return (
          <div
            key={item.id}
            className={clsx('my-2 flex', isOwn ? 'justify-end' : 'justify-start')}
          >
            <p
              className={clsx(
                'inline-block max-w-[85%] rounded-full px-5 py-2 text-sm md:text-base',
                isOwn
                  ? 'bg-gray-dark text-white'
                  : 'bg-gray-lightest text-gray-dark',
              )}
            >
              {item.body}
            </p>
          </div>
        );
      })}
    </div>
  );
}
