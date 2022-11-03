import { Post } from './post.entity';
import { Repository } from 'typeorm';

export interface PostsRepository extends Repository<Post> {
  findOrderByCreateAt(offset: number): Promise<Post>;
}

type CustomUserRepository = Pick<PostsRepository, 'findOrderByCreateAt'>;

export const customPostsRepositoryMethods: CustomUserRepository = {
  async findOrderByCreateAt(offset: number): Promise<Post> {
    try {
      return await this.createQueryBuilder('posts')
        .orderBy('posts.created_at', 'DESC')
        .offset(offset)
        .limit(20)
        .getMany();
    } catch (e) {
      console.log(e);
    }
  },
};
