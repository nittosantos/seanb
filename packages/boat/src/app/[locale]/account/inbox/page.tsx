import { Suspense } from 'react';
import InboxContent from '@/components/inbox/inbox-content';
import Text from '@/components/ui/typography/text';

function InboxFallback() {
  return (
    <div className="container-fluid w-full py-8 md:py-12 xl:py-16">
      <Text className="text-center text-gray">Loading...</Text>
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={<InboxFallback />}>
      <InboxContent />
    </Suspense>
  );
}
