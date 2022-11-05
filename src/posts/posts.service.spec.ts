import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostsRepository } from './entity/posts.repository';
import { PostsService } from './posts.service';
const data = {
  title: 'title',
  content: 'content',
  password: '123456',
};
const mockPostRepository = () => ({
  create: jest.fn((e) => e),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(() => {
    return {
      title: 'title',
      content: 'content',
      password: '123456',
    };
  }),
  update: jest.fn(),
  delete: jest.fn(),
  findOrderByCreateAt: jest.fn(() => {
    return {
      title: 'title',
      content: 'content',
      password: '123456',
    };
  }),
});
describe('PostsService', () => {
  let service: PostsService;
  let spyRepository: PostsRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useFactory: mockPostRepository,
        },
      ],
    }).compile();
    service = module.get<PostsService>(PostsService);
    spyRepository = module.get<PostsRepository>(getRepositoryToken(Post));
  });

  it('createPosts() - 성공 ', async () => {
    await service.createPosts(data);

    expect(spyRepository.create).toHaveBeenCalled();
    expect(spyRepository.create).toHaveBeenCalledWith(data);
    expect(spyRepository.save).toHaveBeenCalled();
    expect(spyRepository.save).toHaveBeenCalledWith(data);
  });

  it('findPostOrderBy() - 성공 ', async () => {
    const offset = 0;

    const result = await service.findPostOrderBy(offset);

    expect(spyRepository.findOrderByCreateAt).toHaveBeenCalled();
    expect(spyRepository.findOrderByCreateAt).toHaveBeenCalledWith(offset);
    expect(result).toEqual(data);
  });

  it('findPostById() - 성공 ', async () => {
    const id = 1;

    const result = await service.findPostById(id);

    expect(spyRepository.findOne).toHaveBeenCalled();
    expect(spyRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(data);
  });

  it('updatePost() - 성공 ', async () => {
    const id = 1;
    spyRepository.findOne = jest.fn(async () => {
      const result: Post = new Post();
      result.update(data);
      result.password = data.password;
      return result;
    });
    service.isPassword = jest.fn((a, b) => {
      return a === b;
    });

    await service.updatePost(id, data);

    expect(spyRepository.findOne).toHaveBeenCalled();
    expect(spyRepository.findOne).toHaveBeenCalledWith({
      select: { password: true },
      where: { id },
    });
    expect(spyRepository.update).toHaveBeenCalled();
    expect(spyRepository.update).toHaveBeenCalledWith(id, data);
  });

  it('updatePost() - 비밀번호 다른 경우 ', () => {
    const id = 1;

    expect(async () => await service.updatePost(id, data)).rejects.toThrowError(
      new BadRequestException('비밀번호가 다릅니다.'),
    );
  });

  it('updatePost() - id가 없는 경우 ', () => {
    const id = 3;

    spyRepository.findOne = jest.fn(() => {
      return null;
    });

    expect(async () => await service.updatePost(id, data)).rejects.toThrowError(
      new NotFoundException('경로가 잘못되었습니다.'),
    );
  });

  it('deletePost() - 성공 ', async () => {
    const id = 1;
    service.isPassword = jest.fn((a, b) => {
      return a === b;
    });
    await service.deletePost(id, data.password);

    expect(spyRepository.findOne).toHaveBeenCalled();
    expect(spyRepository.findOne).toHaveBeenCalledWith({
      select: { password: true },
      where: { id },
    });
    expect(spyRepository.delete).toHaveBeenCalled();
    expect(spyRepository.delete).toHaveBeenCalledWith(id);
  });

  it('deletePost() - 비밀번호 다른 경우 ', () => {
    const id = 1;

    expect(
      async () => await service.deletePost(id, data.password),
    ).rejects.toThrowError(new BadRequestException('비밀번호가 다릅니다.'));
  });

  it('deletePost() - id가 없는 경우 ', () => {
    const id = 3;

    spyRepository.findOne = jest.fn(() => {
      return null;
    });

    expect(
      async () => await service.deletePost(id, data.password),
    ).rejects.toThrowError(new NotFoundException('경로가 잘못되었습니다.'));
  });
});
