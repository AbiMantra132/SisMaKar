import { Controller, Post, Body, Param, Patch, Delete, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('schedule-change')
  async createScheduleChangeRequest(@Body() data: any) {
    console.log('Received data:', data);
    return this.notificationService.createScheduleChangeRequest(data);
  }

  @Patch('accept/:id')
  async acceptLeaveNotification(@Param('id') id: string) {
    return this.notificationService.acceptLeaveNotification(Number(id));
  }

  @Patch('reject/:id')
  async rejectLeaveNotification(@Param('id') id: string) {
    return this.notificationService.rejectLeaveNotification(Number(id));
  }

  @Get('receiver/:receiverId')
  async getNotificationsByReceiverId(@Param('receiverId') receiverId: string) {
    return this.notificationService.getNotificationsByReceiverId(Number(receiverId));
  }

  @Get('role/:role')
  async getNotificationsByRole(@Param('role') role: 'HR' | 'EMPLOYEE' | 'ADMIN' | 'HEAD') {
    return this.notificationService.getNotificationsByRole(role);
  }

  @Patch('read/:id')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(Number(id));
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationService.deleteNotification(Number(id));
  }

  @Get('sender/:senderId')
  async getNotificationsBySenderId(@Param('senderId') senderId: string) {
    return this.notificationService.getNotificationsBySenderId(Number(senderId));
  }
}
