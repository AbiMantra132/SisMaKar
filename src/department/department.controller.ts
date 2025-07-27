import { Controller, Get, Param } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('head-id/:name')
  async getDepartmentHeadId(@Param('name') name: string) {
    const headId = await this.departmentService.findDepartmentHeadId(name);
    return { headId };
  }
}
