import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ScheduleService],
  controllers: [ScheduleController],
  imports: [PrismaModule]
})
export class ScheduleModule {}
  