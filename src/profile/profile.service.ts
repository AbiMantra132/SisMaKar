import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { CompleteProfileDto, UpdateProfileDto } from './dto/index';

@Injectable()
export class ProfileService {
  private prisma = new PrismaClient();

  async getCompleteProfile(userId: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        age: true,
        department: true,
        position: true,
        email: true,
        role: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tasks = await this.prisma.task.findMany({
      where: { assignedTo: userId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });



    return {
      user,
      tasks,
    };
  }


  async updateProfile(userId: number, updateData: UpdateProfileDto) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        age: true,
        department: true,
        position: true,
        email: true,
      }
    });
  }

  async deleteProfile(userId: number) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
