import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the authorization header
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token, {secret: process.env.JWT_SECRET}); // Verify the token
      req.user = payload; // Attach the payload to the request object
      next();
    } catch (err) {
        console.log('-------- err ---------', err);

      return res.status(401).send('Unauthorized');
    }
  }
}