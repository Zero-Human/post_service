import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePost } from './dto/create-post.dto';
import { UpdatePost } from './dto/update-post.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async createPost(@Body() createPosts: CreatePost) {
    await this.postsService.createPosts(createPosts);
    return Object.assign({
      statusCode: 201,
      message: '게시물 생성에 성공하였습니다.',
    });
  }

  @Get('')
  async getPost(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const data = await this.postsService.findPostOrderBy(offset);
    return Object.assign({
      statusCode: 200,
      data,
    });
  }

  @Get(':id')
  async getPostDetail(@Param('id', ParseIntPipe) id: number) {
    const data = await this.postsService.findPostById(id);
    return Object.assign({
      statusCode: 200,
      data,
    });
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePost: UpdatePost,
  ) {
    await this.postsService.updatePost(id, updatePost);
    return Object.assign({
      statusCode: 200,
      message: '게시물 수정에 성공하였습니다.',
    });
  }

  @Delete(':id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('password') password: string,
  ) {
    await this.postsService.deletePost(id, password.toString());
    return Object.assign({
      statusCode: 200,
      message: '게시물 삭제에 성공하였습니다.',
    });
  }
}
