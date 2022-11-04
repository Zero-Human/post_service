import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostDto } from '../dto/post.dto';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  title: string;

  @Column('varchar', { length: 200 })
  content: string;

  @Column('varchar', { length: 100, select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  async saveEncryptedPassword() {
    this.password = await bcrypt.hash(this.password, 5);
  }
  update(dto: PostDto): Post {
    this.content = dto?.content;
    this.title = dto?.title;
    return this;
  }
}
