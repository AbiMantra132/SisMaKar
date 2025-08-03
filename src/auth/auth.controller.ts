import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'generated/prisma';
import { LoginDto, SignupDto } from './dto/index';
import * as jwt from 'jsonwebtoken';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import {
  Get,
  Req,
  Res,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test') 
  async test() {
    return { message: 'Auth service is running' };
  }

  @Get('verify')
  async verify(
    @Req() request: ExpressRequest,
    @Res() response: ExpressResponse,
  ) {
    const token = request.cookies['auth-token'];
    const jwtSecret = process.env.JWT_SECRET;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded) {
      return response.status(200).json({ loggedIn: true, user: decoded });
    }

    return response.status(401).json({ loggedIn: false });
  }

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    try {
      const user: User = await this.authService.signup(signupDto);
      console.log('User created:', user);
      const token = this.authService.generateToken(user);

      return {
        success: true,
        token: token,
        message: 'Account registered successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      console.error('Signup error:', error);

      throw new InternalServerErrorException(
        'Unable to process signup request',
      );
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: ExpressResponse,
  ) {
    try {
      const user: User = await this.authService.login(loginDto);
      const token = await this.authService.generateToken(user);

      response.cookie('auth-token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return {
        success: true,
        message: 'Account loggedin successfully',
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }

      console.error('Login error:', error);

      throw new InternalServerErrorException('Unable to process login request');
    }
  }

  @Get('role')
  getUserRole(@Req() request: ExpressRequest) {
    const role = this.authService.getUserRoleFromCookies(request);
    if (!role) {
      throw new UnauthorizedException('User role not found or invalid token');
    }
    return { role };
  }
}
