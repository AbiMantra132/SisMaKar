import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class EmployeesService {
  constructor(
    private prisma: PrismaService
  ) {}

  async getAllEmployees(page: number = 1, limit: number = 25): Promise<{ data: User[], total: number, pages: number }> {
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getEmployeesByDepartment(department: string, page: number = 1, limit: number = 25): Promise<{ data: User[], total: number, pages: number }> {
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          department: {
            name: department
          }
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          department: {
            name: department
          }
        }
      }),
    ]);

    return {
      data: users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getEmployeesByStatus(status: string, page: number = 1, limit: number = 25): Promise<{ data: User[], total: number, pages: number }> {
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          statusEmployee: status
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          statusEmployee: status
        }
      }),
    ]);

    return {
      data: users,
      total,
      pages: Math.ceil(total / limit),
    };
  } 

  async updateEmployeeProfile(
    employeeId: number,
    data: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
      password?: string;
      age?: number;
      department?: string;
      position?: string;
      role?: string;
    }
  ): Promise<User> {
    const updateData: any = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
      age: data.age,
      position: data.position,
      role: data.role,
    };

    if (data.department) {
      updateData.departmentName = data.department;
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    return this.prisma.user.update({
      where: { id: employeeId },
      data: updateData,
    });
  }

  async getEmployeeCount(): Promise<number> {
    return this.prisma.user.count();
  }
}
