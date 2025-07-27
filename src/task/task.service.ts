import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from 'generated/prisma';
import { addTaskDto, deleteTaskDto, UpdateTaskDto } from './dto/index';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(taskData: addTaskDto): Promise<Task> {
    try {
      const department = await this.prisma.department.findUnique({
        where: { name: taskData.departmentName },
      });

      if (!department || !department.id) {
        throw new Error(`Department with name ${taskData.departmentName} not found`);
      }

      const data = await this.prisma.task.create({
        data: {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          user: {
            connect: { id: taskData.assignedTo }
          },
          department: {
            connect: { id: department.id }
          }
        },
      });

      console.log("Task created successfully:", data);
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(taskData: UpdateTaskDto): Promise<Task> {
    return await this.prisma.task.update({
      where: { id: taskData.id },
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
      },
    });
  }

  async delete(taskData: deleteTaskDto): Promise<Task> {
    return await this.prisma.task.delete({
      where: { id: taskData.id },
    });
  }

  async getTasksByEmployeeAndDate(employeeId: number, date?: Date): Promise<Task[]> {
    const where: any = {
      assignedTo: employeeId,
    };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.assignedDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    return await this.prisma.task.findMany({
      where,
      orderBy: { assignedDate: 'desc' },
    });
  }
}
