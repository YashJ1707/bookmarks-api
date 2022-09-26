import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from 'src/auth/auth-dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private service: ConfigService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async signin(dto: AuthDto) {
    //search for the email in the database
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //guard if the email does not exist
    if (!user) {
      throw new ForbiddenException('Invalid Credentials');
    }

    //compare the password hash with the one in database
    const pwHash = await argon.verify(user.hash, dto.password);

    //guard error if the passwords do not match

    if (!pwHash) {
      throw new ForbiddenException('Invalid Credentials');
    }

    return this.signToken(user.id, user.email);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);
    // console.log(hash);

    // console.log({ email: dto.email, password: dto.password });

    //generate the data for the user
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
        throw error;
      }
    }
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.service.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
