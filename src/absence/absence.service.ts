import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AbsenceService {
  constructor(private prisma: PrismaService) {}

  async upsertAbsence(data: {
    userId: number;
    date: Date;
    reason?: string;
    datetime?: Date;
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
      return this.prisma.absence.create({
        data: {
          userId: data.userId,
          date: data.date,
          reason: data.reason ?? '',
          checkin: data.datetime,
          workHours: data.workHours,
          status: data.status ?? 'present',
        },
      });
    }

    return this.prisma.absence.update({
      where: { id: absence.id },
      data: { checkout: data.datetime },
    });
  }

  async getAttendanceSummaryAll(startDate: Date, endDate: Date) {
    const [absences, schedules, leaves] = await Promise.all([
      this.prisma.absence.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.schedule.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.leave.findMany(),
    ]);

    const userIds = Array.from(new Set(schedules.map(s => s.userId)));

    let totalOnTime = 0;
    let totalAbsent = 0;
    let totalLateArrival = 0;
    let totalEarlyDeparture = 0;
    let totalTimeOff = 0;

    for (const userId of userIds) {
      const userSchedules = schedules.filter(s => s.userId === userId);

      for (const schedule of userSchedules) {
        const dateKey = schedule.date.toISOString().split('T')[0];
        const absence = absences.find(a => a.userId === userId && a.date.toISOString().split('T')[0] === dateKey);

        if (absence?.isLeave) {
          totalTimeOff++;
          continue;
        }

        if (!absence) {
          totalAbsent++;
          continue;
        }

        if (absence.status !== 'present') {
          totalAbsent++;
          continue;
        }

        let isLate = false;
        let isEarly = false;

        if (absence.checkin && schedule.startTime && absence.checkin > schedule.startTime) {
          isLate = true;
        }
        if (absence.checkout && schedule.endTime && absence.checkout < schedule.endTime) {
          isEarly = true;
        }

        if (isLate) totalLateArrival++;
        if (isEarly) totalEarlyDeparture++;
        if (!isLate && !isEarly) totalOnTime++;
      }
    }

    return {
      onTime: totalOnTime,
      absent: totalAbsent,
      lateArrival: totalLateArrival,
      earlyDeparture: totalEarlyDeparture,
      timeOff: totalTimeOff,
    };
  }

  async getDetailedMonthAttendanceSummary(startDate: Date, endDate: Date) {
    const users = await this.prisma.user.findMany({
      include: {
      department: true,
      absences: {
        where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        },
      },
      },
      orderBy: {
      departmentName: 'asc',
      },
    });

    const departmentAttendance: Record<string, string> = {};

    for (const user of users) {
      const filteredAbsences = user.absences.filter(a => a.status !== 'pending');
      const presentCount = filteredAbsences.filter(a => a.status === 'present').length;

      const deptName = user.departmentName || 'Unknown';

      if (!departmentAttendance[deptName]) {
      departmentAttendance[deptName] = '';
      }

      const attendanceString = `${presentCount}`;
      if (departmentAttendance[deptName]) {
      departmentAttendance[deptName] += `, ${attendanceString}`;
      } else {
      departmentAttendance[deptName] = attendanceString;
      }
    }

    return departmentAttendance;
  }

  async getDepartmentAttendancePercentages(startDate: Date, endDate: Date) {
    const users = await this.prisma.user.findMany({
      include: {
        department: true,
        absences: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const departmentMap: Record<string, { present: number; total: number }> = {};

    for (const user of users) {
      const deptName = user.departmentName || 'Unknown';
      if (!departmentMap[deptName]) {
        departmentMap[deptName] = { present: 0, total: 0 };
      }

      const filteredAbsences = user.absences.filter(a => a.status !== 'pending');

      for (const absence of filteredAbsences) {
        if (absence.status === 'present') {
          departmentMap[deptName].present += 1;
        }
        departmentMap[deptName].total += 1;
      }
    }

    const result: Record<string, string> = {};
    for (const [dept, stats] of Object.entries(departmentMap)) {
      const { present, total } = stats;
      if (total === 0) {
        result[dept] = '0';
        continue;
      }
      const presentPct = ((present / total) * 100).toFixed(2);
      result[dept] = presentPct;
    }
    return result;
  }

  async getEmployeeAttendance(startDate: Date, endDate: Date, departmentName?: string) {
    const users = await this.prisma.user.findMany({
      where: departmentName ? { departmentName } : {},
      include: {
        absences: {
          where: {
            ...(startDate && endDate
              ? {
                  date: {
                    gte: startDate,
                    lte: endDate,
                  },
                }
              : {}),
          },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    return users.map(user => ({
      fullName: user.fullName,
      attendance: user.absences.map(absence => ({
      date: absence.date,
      checkIn: absence.checkin,
      checkOut: absence.checkout,
      workHours: absence.workHours,
      })),
    }));
  }

  async getEmployeeLeaveInfo(userId: number) {
    const leave = await this.prisma.leave.findFirst({
      where: { userId },
      select: {
        leaveAmmount: true,
        leaveTotal: true,
      },
    });
    return leave;
  }

  async getAbsenceByUserAndDate(userId: number, date: Date) {
    console.log("Fetching absence for user:", userId, "on date:", date);
    return this.prisma.absence.findFirst({
      where: {
        userId,
        date: {
          equals: date,
        },
      },
    });
  }
}
