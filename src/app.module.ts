import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { TaskModule } from './task/task.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AbsenceModule } from './absence/absence.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [PrismaModule, AuthModule, EmployeesModule, TaskModule, ProfileModule, AbsenceModule, ScheduleModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
