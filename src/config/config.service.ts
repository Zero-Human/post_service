import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Post } from '../posts/entity/post.entity';
// import { Post } from 'src/posts/entity/post.entity';

@Injectable()
export class MySqlConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      port: this.configService.get<number>('DB_PORT'),
      host: this.configService.get<string>('DB_HOST'),
      database: this.configService.get<string>('DB_SCHEMA'),
      entities: [Post],
      synchronize: this.configService.get<boolean>('SYNCHRONIZE'),
      logging: this.configService.get<boolean>('LOGGING'),
      charset: this.configService.get<string>('CHARSET'),
      timezone: this.configService.get<string>('TIMEZONE'),
    };
  }
}
