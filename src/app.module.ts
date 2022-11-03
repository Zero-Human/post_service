import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { MySqlConfigModule } from './config/config.module';
import { MySqlConfigService } from './config/config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [MySqlConfigModule],
      useClass: MySqlConfigService,
      inject: [MySqlConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
