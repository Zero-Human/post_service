import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreatePostsDto } from './dto/create-posts';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post('')
  async createPost(@Body() createPosts: CreatePostsDto) {
    await this.postsService.createPosts(createPosts);
    return Object.assign({
      statusCode: 201,
      message: '게시물 생성에 성공하였습니다.',
    });
  }
  @Get('')
  async getPost(@Query('offset') offset: number) {
    offset = offset ? offset : 0;
    const data = await this.postsService.findPostOrderBy(offset);
    return Object.assign({
      statusCode: 200,
      data,
    });
  }
  @Get(':id')
  async getPostDetail(@Param('id') id: number) {
    const data = await this.postsService.findPostById(id);
    return Object.assign({
      statusCode: 200,
      data,
    });
  }
}
