import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const TEST_PASSWORD = 'password123';

async function main() {
  // Limpar dados existentes (ordem por causa das FKs)
  await prisma.review.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();

  // Planos
  const [litePlan, proPlan, ultimatePlan] = await prisma.plan.createManyAndReturn({
    data: [
      {
        name: 'Lite',
        maxListings: 1,
        priceMonthly: 49,
        priceYearly: 149,
        features: { features: ['1 listing', 'Basic support'] },
      },
      {
        name: 'Pro',
        maxListings: 5,
        priceMonthly: 99,
        priceYearly: 199,
        features: { features: ['5 listings', 'Priority support', 'Analytics'] },
      },
      {
        name: 'Ultimate',
        maxListings: -1, // ilimitado
        priceMonthly: 199,
        priceYearly: 299,
        features: { features: ['Unlimited listings', 'Premium support', 'Featured listings'] },
      },
    ],
  });

  // Usuários (senha: password123)
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  const hostUser = await prisma.user.create({
    data: {
      email: 'fabio@example.com',
      passwordHash,
      name: 'Fabio Jaction',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      username: '@frankiehelene',
      role: 'HOST',
      planId: proPlan.id,
      memberSince: new Date('2014-01-01'),
      languages: ['English', 'Italian'],
      responseRate: 85,
      responseTime: 'Within an hour',
      location: 'Santa Maria Maggiore, Milazzo',
      coverImage: '/images/listing-details/cover-image.png',
      instagramUserName: 'dontbesovasya',
      twitterUserName: '@dontbesovasya',
    },
  });

  const guestUser = await prisma.user.create({
    data: {
      email: 'maria@example.com',
      passwordHash,
      name: 'Maria W. Ross',
      avatar: 'https://randomuser.me/api/portraits/women/40.jpg',
      username: '@mariawross',
      role: 'GUEST',
    },
  });

  // Listing (baseado no vendorData do frontend)
  const equipment = [
    { img: '/images/listing-details/pilot.svg', name: 'Automatic Pilot' },
    { img: '/images/listing-details/shower.svg', name: 'Deck Shower' },
    { img: '/images/listing-details/motor.svg', name: 'Outboard motor' },
    { img: '/images/listing-details/hot-water.svg', name: 'Hot Water' },
    { img: '/images/listing-details/gps.svg', name: 'GPS' },
    { img: '/images/listing-details/wifi.svg', name: 'Wi Fi' },
  ];

  const specifications = [
    { name: 'Engine Torque', details: '111 ft-lb' },
    { name: 'Engine', details: 'Milwaukee-Eight 107' },
    { name: 'Length', details: '102.4 in.' },
    { name: 'Fuel Capacity', details: '6.00 gal (22.71 L)' },
  ];

  const listing1 = await prisma.listing.create({
    data: {
      slug: 'perfect-set-up-for-lake-union-cruising',
      title: 'Perfect set up for Lake Union cruising',
      description:
        "Do not miss the opportunity to board this magnificent oceanis 35. Finot-Conq's sharp-edged boat hull and the slightly displaced mast will offer you great balance and comfort.",
      price: 215,
      location: 'Santa Maria Maggiore, Milazzo',
      lat: 38.2,
      lng: 15.2,
      images: [
        '/images/top-boats/boat-thirty-one.jpg',
        '/images/top-boats/boat-twenty-two.jpg',
        '/images/top-boats/boat-twelve.png',
        '/images/top-boats/boat-one.jpg',
      ],
      boatName: 'SPORT CRUISER — OCEANIS 35 (2017)',
      boatGuests: 12,
      boatCabins: 3,
      boatBathrooms: 2,
      duration: '3 - 8 hours',
      hasCaptain: false,
      equipment,
      specifications,
      boatType: 'Sailboat',
      userId: hostUser.id,
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      slug: 'smooth-sailing-lake-union',
      title: 'Smooth Sailing for Lake Union cruising',
      description: 'Enjoy a relaxing day on the water with this beautiful sailboat.',
      price: 230,
      location: 'Kraig Pike',
      images: [
        '/images/top-boats/boat-nine.png',
        '/images/top-boats/boat-six.jpg',
        '/images/top-boats/boat-three.jpg',
      ],
      boatGuests: 8,
      boatCabins: 2,
      boatBathrooms: 1,
      duration: '4 - 7 hours',
      hasCaptain: false,
      equipment,
      boatType: 'Sailboat',
      userId: hostUser.id,
    },
  });

  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 14);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);

  await prisma.reservation.create({
    data: {
      listingId: listing1.id,
      guestId: guestUser.id,
      checkIn,
      checkOut,
      totalPrice: 215 * 3,
      status: 'CONFIRMED',
    },
  });

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Amazing experience! The boat was in perfect condition.',
        location: 'San Diego CA',
        listingId: listing1.id,
        userId: guestUser.id,
      },
      {
        rating: 5,
        comment: 'Great day on the water. Highly recommend!',
        location: 'Los Angeles CA',
        listingId: listing2.id,
        userId: guestUser.id,
      },
    ],
  });

  console.log('✅ Seed concluído!');
  console.log('   - 3 planos (Lite, Pro, Ultimate)');
  console.log('   - 2 usuários (1 Host, 1 Guest) - senha: password123');
  console.log('   - 2 listings');
  console.log('   - 1 reservation');
  console.log('   - 2 reviews');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
