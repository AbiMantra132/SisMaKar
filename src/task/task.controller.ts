import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import {UpdateTaskDto, addTaskDto, deleteTaskDto} from './dto/index';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('create')
  async createTask(@Body() taskData: addTaskDto) {
    try {
      return await this.taskService.create(taskData);
    } catch (error) {
      // You can customize the error handling as needed
      throw error;
    }
  }

  @Put('update')
  async updateTask(@Body() taskData: UpdateTaskDto) {
    return await this.taskService.update(taskData);
  }

  @Delete('delete')
  async deleteTask(@Body() taskData: deleteTaskDto) {
    return await this.taskService.delete(taskData);
  }
}
