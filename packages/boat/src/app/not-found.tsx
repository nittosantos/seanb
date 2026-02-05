import Link from 'next/link';
import NotFoundError from '@/components/errors/not-found-error';

export default function RootNotFound() {
  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full bg-white py-5 md:flex md:h-20 md:items-center md:bg-transparent xl:h-24">
        <div className="container-fluid flex w-full items-center justify-between">
          <Link href="/" className="brand-logo inline-flex max-w-[120px] text-black">
            <span className="text-xl font-bold">Boat Rental</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold capitalize text-gray-dark hover:bg-gray-50"
          >
            Back to home
          </Link>
        </div>
      </header>
      <NotFoundError />
    </>
  );
}
