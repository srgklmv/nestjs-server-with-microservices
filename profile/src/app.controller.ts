import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FindProfilesDto } from './dto/find-profiles.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './profile.entity';
import { LoginDto } from './dto/login.dto';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserIsUserGuard } from './user-is-user.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  getProfiles(@Query() findProfilesDto: FindProfilesDto): Promise<Profile[]> {
    console.log('ProfileController: getProfiles', new Date());
    return this.appService.getProfiles(findProfilesDto);
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  createProfile(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    console.log('ProfileController: createProfile', new Date());
    return this.appService.createProfile(createProfileDto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  updateProfile(@Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    console.log('ProfileController: updateProfile', new Date());
    return this.appService.updateProfile(updateProfileDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  deleteProfile(@Query('login') login: string): Promise<string> {
    console.log('ProfileController: deleteProfile', new Date());
    return this.appService.deleteProfile(login);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    console.log('ProfileController: login', new Date());
    return this.appService.login(loginDto);
  }
}
