import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Post('')
  async createPost(@Body() createPosts: PostDto) {
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

  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() updatePost: PostDto) {
    const data = await this.postsService.updatePost(id, updatePost);
    return Object.assign({
      statusCode: 200,
      data,
    });
  }
}
