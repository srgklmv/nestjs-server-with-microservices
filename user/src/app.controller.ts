import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TO_USER') private client_to_user: ClientProxy,
  ) {
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log('UserController: createUser', new Date());
    return this.appService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  async login(loginDto: CreateUserDto): Promise<{ token: string }> {
    console.log('UserController: login', new Date());
    return this.appService.login(loginDto);
  }

  @MessagePattern({ cmd: 'deleteUser' })
  async deleteUser(login: { login: string }): Promise<DeleteResult> {
    console.log('UserController: deleteUser', new Date());
    return this.appService.deleteUser(login.login);
  }
}

