export class CreateAbsenceDto {
  userId: number;
  date: Date;
  reason: string;
  checkin?: Date;
  checkout?: Date;
  workHours?: number;
}