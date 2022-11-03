import { Post } from './post.entity';
import { Repository } from 'typeorm';

export interface PostsRepository extends Repository<Post> {
  findPostByPassword(password: string): Promise<Post>;
}

type CustomUserRepository = Pick<PostsRepository, 'findPostByPassword'>;

export const customPostsRepositoryMethods: CustomUserRepository = {
  async findPostByPassword(password: string): Promise<Post> {
    try {
      console.log(this);
      return await this.createQueryBuilder('posts')
        .where('posts.password = :password', { password })
        .getMany();
    } catch (e) {
      console.log(e);
    }
  },
};
