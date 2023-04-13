import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from './profile.entity';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FindProfilesDto } from './dto/find-profiles.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('TO_USER') private client_to_user: ClientProxy,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {
  }

  async getProfiles(findProfilesDto: FindProfilesDto): Promise<Profile[]> {
    console.log('ProfileService: getProfiles', new Date());
    const profiles = await this.profileRepository.findBy(findProfilesDto);
    if (profiles.length === 0) {
      throw new HttpException('Пользователи не найдены!', HttpStatus.BAD_REQUEST);
    }
    return profiles;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    console.log('ProfileService: updateProfile', new Date());
    const profile = await this.profileRepository.findOneBy(
      {login: updateProfileDto.login}
    );
    if (!profile) {
      throw new HttpException('Пользователя с таким логином не существует', HttpStatus.BAD_REQUEST);
    }
    await this.profileRepository.update(
      {login: updateProfileDto.login},
      updateProfileDto,
    );

    return this.profileRepository.findOneBy(
      {login: updateProfileDto.login}
    );
  }

  async deleteProfile(login): Promise<string> {
    console.log('ProfileService: deleteProfile', new Date());
    const profile = await this.profileRepository.findOneBy(
      {login: login}
    );
    if (!profile) {
      throw new HttpException('Пользователя с таким логином не существует', HttpStatus.BAD_REQUEST);
    }
    await this.client_to_user.send<{}>(
      { cmd: 'deleteUser' },
      { login: login },
    ).subscribe();
    await this.profileRepository.delete({login: login});
    return 'Профиль был удалён!';
  }

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    console.log('ProfileService: createProfile', new Date());
    //Check if profile with similar login exists
    const existingProfile = await this.profileRepository.findOneBy({
      login: createProfileDto.login,
    });
    if (existingProfile) {
      throw new HttpException(
        'Произошла ошибка! Пользователь с таким логином уже существует.',
        HttpStatus.BAD_REQUEST,
      );
    }
    //Create profile and user
    const newProfile = await this.profileRepository.save(createProfileDto);
    await this.client_to_user.send<{}>(
      { cmd: 'createUser' },
      {
        login: createProfileDto.login,
        password: createProfileDto.password,
      },
    ).subscribe();
    return newProfile;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    console.log('ProfileService: login', new Date());
    const response = await firstValueFrom(this.client_to_user.send(
      { cmd: 'login' },
      loginDto,
    ));
    if (response.token === 'Wrong Password or Login Error') {
      throw new UnauthorizedException({ message: 'Неверный пароль или логин!' });
    }
    return response;
  }
}