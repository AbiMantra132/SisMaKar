import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [PrismaModule]
})
export class DepartmentModule {}
