import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) {}

    async authenticateUser(privyToken: string, email: string): Promise<string> {

        // THIS WOULD'VE BEEN THE PRIVY VALIDATION STEP BUT THE npm install @privy-io/server-auth@latest LIBRARY
        // WAS NOT DOWNLOADABLE SO I SKIPPED IT

        // Decode the Privy token to extract the user identifier (`sub`)
        const decodedToken = jwt.decode(privyToken);
        if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.sub) {
            throw new UnauthorizedException('Invalid Privy token');
        }

        const userId = decodedToken.sub; // Extract `sub` as the unique identifier

        // Check if the user exists in the database, or create if not
        let user = await this.usersService.findUserBySub(userId);
        if (!user) {
            user = await this.usersService.addUser({ email, sub: userId });
        }

        // Generate a backend JWT containing the `sub` and `email`
        const metaversalJwt = this.generateToken({ sub: user.sub, email: user.email });
        return metaversalJwt;
    }

    generateToken(payload: { sub: string; email: string }): string {
        return this.jwtService.sign(payload, {secret: process.env.JWT_SECRET});
    }
}