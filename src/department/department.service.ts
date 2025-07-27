import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findDepartmentHeadId(departmentName: string): Promise<number | null> {
    const department = await this.prisma.department.findUnique({
      where: { name: departmentName },
      select: { headId: true },
    });
    return department?.headId ?? null;
  }
}
