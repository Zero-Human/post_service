import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostsDto } from './dto/create-posts';
import { Post } from './entity/post.entity';
import { PostsRepository } from './entity/posts.repository';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostsRepository,
  ) {}

  async createPosts(createPosts: CreatePostsDto) {
    const post = this.postRepository.create(createPosts);
    return await this.postRepository.save(post);
  }
  async findPostOrderBy(offset: number) {
    return await this.postRepository.findOrderByCreateAt(offset);
  }
}
