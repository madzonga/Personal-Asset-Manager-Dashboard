import { Controller, Post, HttpCode, HttpStatus, Body, UsePipes, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { LoginSchema } from './schemas/login.schema';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login Endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        privyToken: { type: 'string', description: 'Privy token for authentication' },
        email: { type: 'string', description: 'User email address' },
      },
      required: ['privyToken', 'email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        email: 'user@example.com',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid Privy token' })
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