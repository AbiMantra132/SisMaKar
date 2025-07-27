import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto/index';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { email, password, fullName, age, department, position, phoneNumber } = signupDto;

    await this.checkUserExists(email);

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName,
        age,
        department: {
          connect: { id: Number(department) },
        },
        position,
        phoneNumber,
      },
    });

    return user;
  }

  async login(LoginDto: LoginDto): Promise<User> {
    const { email, password } = LoginDto;

    if (!email || !password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }

  async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }
  }
}
