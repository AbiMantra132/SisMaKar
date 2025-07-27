import { Body, Controller, Post } from '@nestjs/common';
import { AbsenceService } from './absence.service';

@Controller('absence')
export class AbsenceController {
  constructor(private readonly absenceService: AbsenceService) {}

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
}
