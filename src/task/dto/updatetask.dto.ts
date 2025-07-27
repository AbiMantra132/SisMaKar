export class UpdateTaskDto {
  id: number;
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}