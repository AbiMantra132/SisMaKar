// DTOs
export class UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  departmentName: string; // Changed from department to match schema
  position: string;
  email: string;
  role: 'EMPLOYEE' | 'HR' | 'ADMIN' | 'HEAD';
  statusEmployee: string;
  statusAccount: string;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskDto {
  id: number;
  title: string;
  description: string; // Added missing field
  status: string;
  assignedTo: number; // Added missing field
  departmentId: number; // Added missing field
  createdAt: Date;
  updatedAt: Date;
}

export class CompleteProfileDto {
  user: UserProfileDto;
  tasks: TaskDto[];
}
