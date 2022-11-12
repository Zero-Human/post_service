import { Post } from './post.entity';
import { Repository } from 'typeorm';

export interface PostsRepository extends Repository<Post> {
  findOrderByCreateAt(offset: number): Promise<Post>;
}

type CustomPostsRepository = Pick<PostsRepository, 'findOrderByCreateAt'>;

export const customPostsRepositoryMethods: CustomPostsRepository = {
  async findOrderByCreateAt(offset: number): Promise<Post> {
    return await this.createQueryBuilder('posts')
      .orderBy('posts.created_at', 'DESC')
      .offset(offset)
      .limit(20)
      .getMany();
  },
};
