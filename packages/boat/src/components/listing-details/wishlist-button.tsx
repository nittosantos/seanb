'use client';

import clsx from 'clsx';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '@/components/ui/button';
import { useWishlistToggle } from '@/hooks/use-wishlist';

type WishlistButtonProps = {
  listingId: string;
  className?: string;
  iconClassName?: string;
};

export default function WishlistButton({
  listingId,
  className,
  iconClassName = 'h-auto w-5',
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist, isToggling } = useWishlistToggle();
  const active = isWishlisted(listingId);
  const Icon = active ? HeartSolidIcon : HeartIcon;

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      rounded="pill"
      disabled={isToggling}
      className={clsx(
        '!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white',
        active && '!text-red-500',
        className,
      )}
      onClick={() => void toggleWishlist(listingId)}
    >
      <Icon className={iconClassName} />
    </Button>
  );
}
