import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User],
      synchronize: true,
      migrationsRun: true
    }),
    ClientsModule.register([
      {
        name: 'TO_USER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.TO_USER_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
