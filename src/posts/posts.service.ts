import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDto } from './dto/post.dto';
import { Post } from './entity/post.entity';
import { PostsRepository } from './entity/posts.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostsRepository,
  ) {}

  async createPosts(createPosts: PostDto) {
    const post = this.postRepository.create(createPosts);
    return await this.postRepository.save(post);
  }
  async findPostOrderBy(offset: number) {
    const data = await this.postRepository.findOrderByCreateAt(offset);
    return data;
  }
  async findPostById(id: number) {
    return await this.postRepository.findOne({
      where: { id: id },
    });
  }

  async updatePost(id: number, updatePost: PostDto) {
    let post = await this.postRepository.findOne({
      select: { password: true },
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`${id}`);
    }

    if (!this.isPassword(post.password, post.password)) {
      throw new BadRequestException('비밀번호가 다릅니다.');
    }
    post = post.update(updatePost);
    return await this.postRepository.update(id, post);
  }

  isPassword(password: string, passwordCheck: string): boolean {
    return bcrypt.compareSync(password, passwordCheck);
  }
}
