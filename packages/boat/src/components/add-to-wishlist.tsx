'use client';

import clsx from 'clsx';
import { HeartIcon } from '@/components/icons/heart-icon';
import { useWishlistToggle } from '@/hooks/use-wishlist';

type AddToWishlistProps = {
  listingId: string;
  className?: string;
};

export default function AddToWishlist({
  listingId,
  className,
}: AddToWishlistProps) {
  const { isWishlisted, toggleWishlist, isToggling } = useWishlistToggle();
  const active = isWishlisted(listingId);

  return (
    <button
      type="button"
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      disabled={isToggling}
      className={clsx(
        'absolute top-4 right-4 z-10 inline-block transition-transform duration-200 active:scale-75 disabled:opacity-60',
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleWishlist(listingId);
      }}
    >
      <HeartIcon
        className={clsx('h-auto w-[22px] text-gray-dark/20', {
          '!text-red-500': active,
        })}
      />
    </button>
  );
}
