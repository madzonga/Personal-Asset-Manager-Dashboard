import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema } from './schemas/login.schema';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';

// Controller
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async login(@Body() body: { privyToken: string; email: string }) {
    const { privyToken, email } = body;
    try {
      const metaversalJwt = await this.authService.authenticateUser(privyToken, email);
      return { token: metaversalJwt, email };
    } catch (error) {
      throw new UnauthorizedException(`Invalid Privy token: ${error}`);
    }
  }
}