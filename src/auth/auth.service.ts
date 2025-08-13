import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/signUp.dto';
import { hash, compare } from 'bcrypt';
import { UserRoles, UserStatus } from 'src/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    try {
      const checkUser: User | null = await this.userRepository.findOne({
        where: { username: signUpDto.username },
      });

      if (checkUser) {
        throw new BadRequestException('username is taken by another user');
      }

      const userData: Omit<User, 'id' | 'tasks'> = {
        username: signUpDto.username,
        password: await hash(signUpDto.password, 10),
        role: UserRoles.USER,
        status: UserStatus.ACTIVE,
      };

      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);

      const result: Omit<User, 'password'> = {
        ...user,
      };

      delete result['password'];

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signIn(
    signInDto: SignUpDto,
  ): Promise<{ accessToken: string; expiredAt: Date }> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: signInDto.username },
      });

      if (!user) {
        throw new UnauthorizedException('username is invalid');
      }

      const isValidPassword = await compare(
        signInDto.password,
        user.password || '',
      );
      if (!isValidPassword) {
        throw new UnauthorizedException('password is invalid');
      }

      const payload = { userId: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payloadData = await this.jwtService.verifyAsync(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const expiredAt = new Date(payloadData?.exp * 1000);

      return {
        accessToken: token,
        expiredAt: expiredAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMe(userId: number): Promise<Omit<User, 'password'>> {
    try {
      const user: User | null = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Can not found user');
      }
      delete user.password;

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
