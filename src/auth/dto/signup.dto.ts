export class SignupDto {
  email: string;
  password: string;
  fullName: string; 
  age: number;
  department: string;
  position: string;
  phoneNumber: string;
  role: "HR" | "EMPLOYEE" | "ADMIN" | "HEAD";
}
