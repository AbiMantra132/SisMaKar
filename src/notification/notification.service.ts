import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}
  async createScheduleChangeRequest(data: {
    senderId: number;
    scheduleId: number;
    type: string;
    message: string;
    relatedDate?: Date;
    originalDate?: Date;
    replacementDate?: Date;
    shiftStart?: Date;
    shiftEnd?: Date;
  }) {
    if (data.type === 'leave') {
      return this.prisma.notification.create({
        data: {
          senderId: data.senderId,
          scheduleId: data.scheduleId,
          type: data.type,
          message: data.message,
          relatedDate: data.relatedDate
            ? new Date(data.relatedDate).toISOString()
            : undefined,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          leaveId: data.scheduleId,
        },
      });
    } else {
      const user = await this.prisma.user.findUnique({
        where: { id: data.senderId },
        include: { department: { include: { departmentHead: true } } },
      });
      if (!user || !user.department) {
        throw new Error('User or department not found');
      }

      const head = user.department.departmentHead;
      if (!head) {
        throw new Error('Department head not found');
      }

      function combineDateAndTime(
        date: Date | undefined,
        time: string | undefined,
      ): string | undefined {
        if (!time) return undefined;
        const baseDate = date ? new Date(date) : new Date();
        const [hours, minutes] = time.split(':').map(Number);
        baseDate.setHours(hours, minutes, 0, 0);
        return baseDate.toISOString();
      }

      return this.prisma.notification.create({
        data: {
          senderId: data.senderId,
          receiverId: head.id,
          receiverRole: 'HEAD',
          scheduleId: data.scheduleId,
          type: data.type,
          message: data.message,
          originalDate: data.originalDate
            ? new Date(data.originalDate).toISOString()
            : undefined,
          replacementDate: data.replacementDate
            ? new Date(data.replacementDate).toISOString()
            : undefined,
          shiftStart: combineDateAndTime(
            data.replacementDate,
            data.shiftStart as unknown as string,
          ),
          shiftEnd: combineDateAndTime(
            data.replacementDate,
            data.shiftEnd as unknown as string,
          ),
          status: 'unread',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  }

  async acceptLeaveNotification(notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'approved',
        updatedAt: new Date(),
      },
    });

    if (notification.scheduleId && notification.replacementDate) {
      await this.prisma.schedule.update({
        where: { id: notification.scheduleId },
        data: {
          date: notification.replacementDate,
          updatedAt: new Date(),
        },
      });

      const scheduleTasks = await this.prisma.scheduleTask.findMany({
        where: { scheduleId: notification.scheduleId },
      });

      for (const st of scheduleTasks) {
        await this.prisma.task.update({
          where: { id: st.taskId },
          data: {
            assignedDate: notification.replacementDate,
            updatedAt: new Date(),
          },
        });
      }
    }

    return { success: true };
  }

  async rejectLeaveNotification(notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new Error('Notification not found');
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: 'rejected',
        updatedAt: new Date(),
      },
    });

    return { success: true };
  }

  async getNotificationsByReceiverId(receiverId: number) {
    return this.prisma.notification.findMany({
      where: { receiverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: number) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'read', updatedAt: new Date() },
    });
  }

  async deleteNotification(notificationId: number) {
    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getNotificationsBySenderId(senderId: number) {
    return this.prisma.notification.findMany({
      where: { senderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotificationsByRole(role: 'HR' | 'EMPLOYEE' | 'ADMIN' | 'HEAD') {
    return this.prisma.notification.findMany({
      where: { receiverRole: role },
      orderBy: { createdAt: 'desc' },
    });
  }
}
