export class UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  age?: number;
  departmentName?: string;
  position?: string;
  email?: string;
  password?: string;
  role?: 'EMPLOYEE' | 'HR' | 'ADMIN' | 'HEAD';
  statusEmployee?: string;
  statusAccount?: string;
  phoneNumber?: string;
}