import { Test, TestingModule } from '@nestjs/testing';
import { CreatePost } from './dto/create-post.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
const mockService = () => ({
  createPosts: jest.fn(),
  findPostOrderBy: jest.fn(() => {
    return {
      title: 'title',
      content: 'content',
      password: '123456',
    };
  }),
  findPostById: jest.fn(() => {
    return {
      title: 'title',
      content: 'content',
      password: '123456',
    };
  }),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
});
describe('PostsController', () => {
  let controller: PostsController;
  let spyService: PostsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    spyService = module.get<PostsService>(PostsService);
  });

  it('createPost() - 성공', async () => {
    const createPost: CreatePost = {
      title: 'title',
      content: 'content',
      password: '123456',
    };

    const result = await controller.createPost(createPost);

    expect(spyService.createPosts).toHaveBeenCalled();
    expect(spyService.createPosts).toHaveBeenCalledWith(createPost);
    expect(result).toEqual(
      Object.assign({
        statusCode: 201,
        message: '게시물 생성에 성공하였습니다.',
      }),
    );
  });

  it('getPost() - 성공', async () => {
    const post = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const offset = 0;

    const result = await controller.getPost(offset);

    expect(spyService.findPostOrderBy).toHaveBeenCalled();
    expect(spyService.findPostOrderBy).toHaveBeenCalledWith(offset);
    expect(result).toEqual(
      Object.assign({
        statusCode: 200,
        data: post,
      }),
    );
  });

  it('getPostDetail() - 성공', async () => {
    const post = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const id = 1;

    const result = await controller.getPostDetail(id);

    expect(spyService.findPostById).toHaveBeenCalled();
    expect(spyService.findPostById).toHaveBeenCalledWith(id);
    expect(result).toEqual(
      Object.assign({
        statusCode: 200,
        data: post,
      }),
    );
  });

  it('updatePost() - 성공', async () => {
    const post = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const id = 1;

    const result = await controller.updatePost(id, post);

    expect(spyService.updatePost).toHaveBeenCalled();
    expect(spyService.updatePost).toHaveBeenCalledWith(id, post);
    expect(result).toEqual(
      Object.assign({
        statusCode: 200,
        message: '게시물 수정에 성공하였습니다.',
      }),
    );
  });

  it('deletePost() - 성공', async () => {
    const id = 1;
    const password = '123456';

    const result = await controller.deletePost(id, password);

    expect(spyService.deletePost).toHaveBeenCalled();
    expect(spyService.deletePost).toHaveBeenCalledWith(id, password);
    expect(result).toEqual(
      Object.assign({
        statusCode: 200,
        message: '게시물 삭제에 성공하였습니다.',
      }),
    );
  });
});
