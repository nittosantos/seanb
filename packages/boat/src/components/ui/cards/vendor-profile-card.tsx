'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { PublicHostProfile } from '@seanb/shared';
import { InstaSolidIcon } from '@/components/icons/instagram-solid-icon';
import { TwitterIcon } from '@/components/icons/twitter-icon';
import Text from '@/components/ui/typography/text';

type VendorProfileCardProps = {
  profile: PublicHostProfile;
};

export default function VendorProfileCard({ profile }: VendorProfileCardProps) {
  const t = useTranslations('profile');

  return (
    <div className="relative flex items-center justify-center px-4 text-center md:mt-8 md:h-[380px] md:justify-between md:overflow-hidden md:rounded-lg md:px-0 md:shadow-card lg:h-[410px] 2xl:mt-12 2xl:h-[460px]">
      <div className="z-10 mt-20 flex h-auto w-full max-w-[343px] flex-col items-center justify-center rounded-lg bg-white p-8 shadow-card md:mt-0 md:h-full md:rounded-none md:shadow-none 2xl:max-w-[537px]">
        <div className="relative inline-block h-[120px] w-[120px] overflow-hidden rounded-full lg:h-40 lg:w-40">
          <Image
            src={profile.avatar || '/images/listing-details/cover-image.png'}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 320) 100vw, 100vw"
            className="h-full w-full object-cover"
          />
        </div>
        <Text tag="h3" className="mt-5 text-lg">
          {t('hiIm', { name: profile.name })}
        </Text>
        {profile.username && (
          <Text className="mt-2 !text-gray">{profile.username}</Text>
        )}
        {profile.instagramUserName && (
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://instagram.com/${profile.instagramUserName.replace('@', '')}`}
            className="relative mt-5 inline-flex items-center text-base font-normal"
          >
            <InstaSolidIcon className="mr-2 h-3 w-3" />
            {profile.instagramUserName}
            <span className="absolute left-0 bottom-0 w-full border-t border-gray-dark"></span>
          </a>
        )}
        {profile.twitterUserName && (
          <a
            rel="noreferrer"
            target="_blank"
            href={`https://twitter.com/${profile.twitterUserName.replace('@', '')}`}
            className="relative mt-2 inline-flex items-center text-base font-normal"
          >
            <TwitterIcon className="mr-2 h-3 w-3" />
            {profile.twitterUserName}
            <span className="absolute left-0 bottom-0 w-full border-t border-gray-dark"></span>
          </a>
        )}
      </div>
      <div className="absolute inset-0 h-80 md:relative md:h-full md:w-full">
        <Image
          src={profile.coverImage}
          alt={profile.name}
          fill
          sizes="(min-width: 320) 100vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
