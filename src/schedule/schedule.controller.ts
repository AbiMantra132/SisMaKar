import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Post('/')
  async createSchedule(@Body() body: {
    userId: number;
    managerId: number;
    date: Date;
    startTime: Date;
    endTime: Date;
    taskIds?: number[];
  }) {
    return this.scheduleService.createSchedule(body);
  }
  @Get('/department/:departmentId')
  async getSchedulesByDepartment(
    @Param('departmentId') departmentId: string,
  ) { 
    return this.scheduleService.getSchedulesByDepartment(departmentId);
  }

  @Get(':id')
  async getScheduleById(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.getScheduleById(id);
  }
  @Get('/user/:userId')
  async getSchedulesByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.scheduleService.getSchedulesByUserId(userId);
  }

  @Put(':id')
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      date?: Date;
      startTime?: Date;
      endTime?: Date;
      status?: string;
      taskIds?: number[];
    },
  ) {
    return this.scheduleService.updateSchedule(id, body);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.scheduleService.deleteSchedule(id);
  }
}
