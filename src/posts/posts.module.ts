import { Module } from '@nestjs/common';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { customPostsRepositoryMethods } from './entity/posts.repository';

const PostRepositoryProvider = {
  provide: getRepositoryToken(Post),
  inject: [getDataSourceToken()],
  useFactory(dataSource: DataSource) {
    return dataSource.getRepository(Post).extend(customPostsRepositoryMethods);
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostRepositoryProvider, PostsService],
})
export class PostsModule {}
