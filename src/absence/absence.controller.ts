import { Body, Controller, Post, Get } from '@nestjs/common';
import { AbsenceService } from './absence.service';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

  @Get('test')
  async test() { 
    return { message: 'Absence service is running' };
  }

  @Post()
  async createOrUpdateAbsence(@Body() body: {
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
    try {
      return await this.absenceService.upsertAbsence(body);
    } catch (error) {
      throw error;
    }

  }

  @Post('get-absence')
  async getAbsenceByUserAndDate(
    @Body() body: { userId: number; date: Date }
  ) {
    try {
      console.log("Fetching absence for user:", body.userId, "on date:", body.date);
      return await this.absenceService.getAbsenceByUserAndDate(body.userId, new Date(body.date));
    } catch (error) {
      throw error;
    }
  }


  @Post('summary')
  async getAttendanceSummary(@Body() body: {
    startDate: Date;
    endDate: Date;
  }) {
    try {
      return await this.absenceService.getAttendanceSummaryAll(
        new Date(body.startDate),
        new Date(body.endDate)
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('detailed-summary')
  async getDetailedMonthAttendanceSummary(@Body() body: {
    startDate: Date;
    endDate: Date;
  }) {
    try {
      return await this.absenceService.getDetailedMonthAttendanceSummary(
        new Date(body.startDate),
        new Date(body.endDate)
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('department-attendance-percentages')
  async getDepartmentAttendancePercentages(@Body() body: {
    startDate: Date;
    endDate: Date;
  }) {
    try {
      return await this.absenceService.getDepartmentAttendancePercentages(
        new Date(body.startDate),
        new Date(body.endDate)
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('employee-attendance')
  async getEmployeeAttendance(@Body() body: {
    startDate: Date;
    endDate: Date;
    departmentName?: string;
  }) {
    try {
      return await this.absenceService.getEmployeeAttendance(
        new Date(body.startDate),
        new Date(body.endDate),
        body.departmentName
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('employee-leave-info')
  async getEmployeeLeaveInfo(@Body() body: { userId: number }) {
    try {
      return await this.absenceService.getEmployeeLeaveInfo(body.userId);
    } catch (error) {
      throw error;
    }
  }
}
