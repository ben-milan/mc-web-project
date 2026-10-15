import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.slice(7);

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? '') as {
        role: string;
      };
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Not an admin');
      }
      return true;
    } catch (err) {
      const error = err as Error;
      console.error('JWT verify failed:', error.name, error.message);
      throw new UnauthorizedException(
        error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      );
    }
  }
}
