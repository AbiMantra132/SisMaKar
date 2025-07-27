import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Schedule, Task } from 'generated/prisma';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  // Create a schedule and optionally link tasks
  async createSchedule(data: {
    userId: number;
    managerId: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    taskIds?: number[];
  }): Promise<Schedule> {
    console.log(data)
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    const manager = await this.prisma.user.findUnique({ where: { id: data.managerId } });

    if (!user || !manager) throw new NotFoundException('User or manager not found');



    // Validate tasks if provided
    if (data.taskIds && data.taskIds.length > 0) {
      const tasks = await this.prisma.task.findMany({ where: { id: { in: data.taskIds } } });
      if (tasks.length !== data.taskIds.length) throw new BadRequestException('One or more tasks not found');
    }
    

    // Create schedule and link tasks
    const result = await this.prisma.schedule.create({
      data: {
      userId: data.userId,
      managerId: data.managerId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      scheduleTasks: data.taskIds
        ? {
          create: data.taskIds.map((taskId) => ({ taskId })),
        }
        : undefined,
      },
      include: { scheduleTasks: true },
    });
    console.log(result);
    return result;
  }

  // Get a schedule by id, including linked tasks
  async getScheduleById(id: number): Promise<Schedule & { scheduleTasks: { task: Task }[] }> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { scheduleTasks: { include: { task: true } } },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return schedule;
  }

  // List all schedules, optionally filter by user or manager
  // Get all schedules for a specific user by userId
  async getSchedulesByUserId(userId: number) {
    return this.prisma.schedule.findMany({
      where: { userId },
      include: { scheduleTasks: { include: { task: true } } },
    });
  }

  //get schedules by department
  async getSchedulesByDepartment(departmentId: string) {

    const department = await this.prisma.department.findUnique({
      where: { name: departmentId },
    });
    if (!department) throw new NotFoundException('Department not found');

    return this.prisma.schedule.findMany({
      where: {
        user: {
          department: {
            id: department.id,
          },
        },
      },
      include: { scheduleTasks: { include: { task: true } } },
    });

  }

  // Update a schedule and its linked tasks
  async updateSchedule(
    id: number,
    data: {
      date?: Date;
      startTime?: Date;
      endTime?: Date;
      status?: string;
      taskIds?: number[];
    },
  ): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');

    // If updating tasks, validate and update relations
    let scheduleTasksUpdate: Prisma.ScheduleTaskUpdateManyWithoutScheduleNestedInput | undefined;
    if (data.taskIds) {
      // Validate tasks
      const tasks = await this.prisma.task.findMany({ where: { id: { in: data.taskIds } } });
      if (tasks.length !== data.taskIds.length) throw new BadRequestException('One or more tasks not found');

      // Remove all existing, then add new
      await this.prisma.scheduleTask.deleteMany({ where: { scheduleId: id } });
      scheduleTasksUpdate = {
        create: data.taskIds.map((taskId) => ({ taskId })),
      };
    }

    return this.prisma.schedule.update({
      where: { id },
      data: {
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        scheduleTasks: scheduleTasksUpdate,
      },
      include: { scheduleTasks: true },
    });
  }

  // Delete a schedule and handle related tasks gracefully
  async deleteSchedule(id: number): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');

    // Remove all schedule-task links first to maintain integrity
    await this.prisma.scheduleTask.deleteMany({ where: { scheduleId: id } });

    // Delete the schedule
    return this.prisma.schedule.delete({ where: { id } });
  }
}
