import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from './user.entity';
import { SignInDto } from './dtos/signIn.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string; expiredAt: Date }> {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('who-am-i')
  getMe(@Req() req: Request) {
    const user = req['user'] as { userId: number };
    return this.authService.getMe(user.userId);
  }
}
