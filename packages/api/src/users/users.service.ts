import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ReservationStatus } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChangePasswordInput,
  UpdateProfileInput,
} from '@seanb/shared';

const profileSelect = {
  id: true,
  email: true,
  name: true,
  avatar: true,
  username: true,
  role: true,
  phone: true,
  bio: true,
  country: true,
  city: true,
  streetAddress: true,
  state: true,
  zipCode: true,
  birthDate: true,
  gender: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: profileSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      birthDate: user.birthDate?.toISOString() ?? null,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileInput) {
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        bio: dto.bio,
        country: dto.country,
        city: dto.city,
        streetAddress: dto.streetAddress,
        state: dto.state,
        zipCode: dto.zipCode,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        gender: dto.gender,
      },
      select: profileSelect,
    });

    return {
      ...user,
      birthDate: user.birthDate?.toISOString() ?? null,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.passwordHash) {
      throw new BadRequestException('Password change is not available');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true };
  }

  async getDashboardStats(userId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        listing: { userId },
      },
      select: {
        status: true,
        totalPrice: true,
      },
    });

    const pending = reservations.filter(
      (item) => item.status === ReservationStatus.PENDING,
    );

    const revenueItems = reservations.filter(
      (item) =>
        item.status === ReservationStatus.CONFIRMED ||
        item.status === ReservationStatus.COMPLETED,
    );

    const toNumber = (value: { toString(): string }) => Number(value.toString());

    const totalRevenue = revenueItems.reduce(
      (sum, item) => sum + toNumber(item.totalPrice),
      0,
    );

    const avgOrderRevenue =
      revenueItems.length > 0 ? totalRevenue / revenueItems.length : 0;

    return {
      pendingOrders: pending.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOrderRevenue: Math.round(avgOrderRevenue * 100) / 100,
    };
  }
}
