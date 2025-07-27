import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AbsenceService {
  constructor(private prisma: PrismaService) {}

  async upsertAbsence(data: {
    userId: number;
    date: Date;
    reason?: string;
    checkin?: Date;
    checkout?: Date;
    workHours?: number;
    leaveAmmount?: number;
    leaveTotal?: number;
    status?: string;
  }) {
    const absence = await this.prisma.absence.findFirst({
      where: {
        userId: data.userId,
        date: data.date,
      },
    });

    if (!absence) {
      // Create new absence
      return this.prisma.absence.create({
        data: {
          userId: data.userId,
          date: data.date,
          reason: data.reason ?? '',
          checkin: data.checkin,
          checkout: data.checkout,
          workHours: data.workHours,
          leaveAmmount: data.leaveAmmount ?? 12,
          leaveTotal: data.leaveTotal ?? 0,
          status: data.status ?? 'pending',
        },
      });
    }

    // If checkout is provided and different, update checkout
    if (
      data.checkout &&
      (!absence.checkout || absence.checkout.getTime() !== data.checkout.getTime())
    ) {
      return this.prisma.absence.update({
        where: { id: absence.id },
        data: { checkout: data.checkout },
      });
    }

    // No update needed
    return null;
  }
}
