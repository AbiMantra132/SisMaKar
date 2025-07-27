import {
  Body,
  Controller,
  Post,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { User } from 'generated/prisma';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post('all')
  async getEmployees(@Body() data: { page: number }) {
    const itemsPerPage = 10;
    const skip = (data.page - 1) * itemsPerPage;
    return this.employeesService.getAllEmployees(skip, itemsPerPage);
  }

  @Post('/department/:department')
  async getEmployeesByDepartment(
    @Param('department') department: string,
    @Body() data: { page: number },
  ) {
    const itemsPerPage = 10;
    const skip = (data.page - 1) * itemsPerPage;
    return this.employeesService.getEmployeesByDepartment(
      department,
      skip,
      itemsPerPage,
    );
  }

  @Post('/status/:status')
  async getEmployeesByStatus(
    @Param('status') status: string,
    @Body() data: { page: number },
  ) {
    const itemsPerPage = 10;
    const skip = (data.page - 1) * itemsPerPage;
    return this.employeesService.getEmployeesByStatus(
      status,
      skip,
      itemsPerPage,
    );
  }

  @Put('update/:employeeId')
  async updateEmployeeProfile(
    @Param('employeeId') employeeId: string,
    @Body()
    data: {
      fullName?: string;
      phoneNumber?: string;
      email?: string;
      password?: string;
      age?: number;
      department?: string;
      position?: string;
      role?: string;
    },
  ) {
    const id = Number(employeeId);
    return this.employeesService.updateEmployeeProfile(id, data);
  }
}
