import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(JwtService) private jwtService: JwtService,
  ) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log('UserService: createUser', new Date());
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    return await this.userRepository.save({ ...createUserDto, password: hashPassword });
  }

  async login(loginDto: CreateUserDto): Promise<{ token: string }> {
    console.log('UserService: login', new Date());
    const user: User = await this.validateUser(loginDto);
    if (user.password === 'Wrong Password or Login Error') {
      return { token: 'Wrong Password or Login Error' };
    }
    return await this.generateToken(user);
  }

  async deleteUser(login: string): Promise<DeleteResult> {
    console.log('UserService: deleteUser', new Date());
    return this.userRepository.delete({ login: login });
  }

  private async validateUser(loginDto: CreateUserDto): Promise<User> {
    console.log('UserService: validateUser', new Date());
    const user: User = await this.userRepository.findOneBy({
        login: loginDto.login,
      },
    );
    const passwordEqual: boolean = await bcrypt.compare(loginDto.password, user.password);
    if (user && passwordEqual) {
      return user;
    }
    return { id: 0, login: loginDto.login, password: 'Wrong Password or Login Error' };
  }

  private async generateToken(user: User): Promise<{ token: string }> {
    console.log('UserService: generateToken', new Date());
    const payload = { id: user.id, login: user.login };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
