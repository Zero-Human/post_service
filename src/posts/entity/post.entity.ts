import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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
}
