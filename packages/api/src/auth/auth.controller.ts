import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
} from '@seanb/shared';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ZodBody } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@ZodBody(registerSchema) dto: RegisterInput) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@ZodBody(loginSchema) dto: LoginInput) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  async forgotPassword(@ZodBody(forgotPasswordSchema) dto: ForgotPasswordInput) {
    return this.authService.forgotPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser('id') userId: string) {
    return this.authService.me(userId);
  }
}
