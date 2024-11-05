import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
) {}
  @Post()
  @HttpCode(HttpStatus.OK)
      // Endpoint to exchange Privy token for backend JWT
      @Post()
      @HttpCode(HttpStatus.OK)
      async login(@Body('privyToken') privyToken: string, @Body('email') email: string) {
          try {
              const metaversalJwt = await this.authService.authenticateUser(privyToken, email);
              return { token: metaversalJwt, email };
          } catch (error) {
              throw new UnauthorizedException('Invalid Privy token');
          }
      }

  // async authenticateUser(@Body() body: { privyToken: string; email: string }) {
  //   const { privyToken, email } = body;
  
  //   // Call AuthService to exchange Privy.io JWT for Metaversal JWT
  //   const metaversalJwt = await this.authService.authenticate(privyToken, email);
  
  //   if (!metaversalJwt) {
  //     throw new UnauthorizedException('Invalid Privy.io token');
  //   }
  
  //   return { token: metaversalJwt, email };
  // }
}