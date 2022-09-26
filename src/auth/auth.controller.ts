import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/auth/auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // console.log({
    //   email: dto.email,
    //   password: dto.password,
    // });
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
