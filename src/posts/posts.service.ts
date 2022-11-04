import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePost } from './dto/update-post.dto';

import { Post } from './entity/post.entity';
import { PostsRepository } from './entity/posts.repository';
import * as bcrypt from 'bcrypt';
import { CreatePost } from './dto/create-post.dto';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: PostsRepository,
  ) {}

  async createPosts(createPosts: CreatePost) {
    const post = this.postRepository.create(createPosts);
    await this.postRepository.save(post);
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

  async updatePost(id: number, updatePost: UpdatePost) {
    let post = await this.postRepository.findOne({
      select: { password: true },
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`${id}`);
    }

    if (!this.isPassword(post.password, updatePost.password)) {
      throw new BadRequestException('비밀번호가 다릅니다.');
    }
    post = post.update(updatePost);
    await this.postRepository.update(id, post);
  }

  async deletePost(id: number, password: string) {
    const post = await this.postRepository.findOne({
      select: { password: true },
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`${id}`);
    }
    if (!this.isPassword(post.password, password)) {
      throw new BadRequestException('비밀번호가 다릅니다.');
    }
    return await this.postRepository.delete(id);
  }

  isPassword(password: string, passwordCheck: string): boolean {
    return bcrypt.compareSync(passwordCheck, password);
  }
}
