import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'generated/prisma';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies['auth-token'];
      const jwtSecret = process.env.JWT_SECRET;

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret is not configured');
      }

      const decoded = jwt.verify(token, jwtSecret) as { User: User };

      if (!decoded || !decoded.User) {
        throw new UnauthorizedException('Invalid token structure');
      }

      const user = decoded.User;
      if (!user.role) {
        throw new UnauthorizedException('User role not specified');
      }

      req['user'] = decoded;
      req['userRole'] = user.role;

      const path = req.path;
      
      if (path.startsWith('/admin') && user.role !== 'ADMIN') {
        throw new ForbiddenException('Admin access required');
      }

      if (path.startsWith('/employee') && user.role !== 'EMPLOYEE' && user.role !== 'ADMIN') {
        throw new ForbiddenException('Employee or Admin access required');
      }

      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token or not authenticated');
    }
  }
}
