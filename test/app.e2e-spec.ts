import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { Post } from './../src/posts/entity/post.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    postRepository = moduleFixture.get('PostRepository');
  });
  afterEach(async () => {
    // e2e 테스트가 끝나면 db를 drop해야 함
    await Promise.all([
      app.close(),
      await postRepository.query('DROP TABLE posts'),
    ]);
  });

  it('/posts post - 성공', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };

    await request(app.getHttpServer()).post('/posts').send(data).expect({
      statusCode: 201,
      message: '게시물 생성에 성공하였습니다.',
    });
  });

  it('/posts post - 실패 제목 20자 넘음', async () => {
    const data = {
      title: 'titleqwqweqweqweqweqweeqwe',
      content: 'content',
      password: '123456',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['제목은 최대 20자입니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 제목이 없는 경우', async () => {
    const data = {
      title: '',
      content: 'content',
      password: '123456',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['제목은 내용이 있어야합니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 본문 200자 넘음', async () => {
    const data = {
      title: 'title',
      content:
        'contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentconte',
      password: '123456',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['본문은 최대 200자입니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 본문이 없는 경우', async () => {
    const data = {
      title: 'title',
      content: '',
      password: '123456',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['본문은 내용이 있어야합니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 비밀번호에 숫자가 없는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '비밀번호입니다.',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['비밀번호는 숫자가 포함되어야합니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 비밀번호가 6자 미만인 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '12345',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['비밀번호는 최소 6자입니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts post - 실패 비밀번호가 없는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '',
    };

    await request(app.getHttpServer())
      .post('/posts')
      .send(data)
      .expect({
        statusCode: 400,
        message: [
          '비밀번호는 숫자가 포함되어야합니다.',
          '비밀번호는 최소 6자입니다.',
        ],
        error: 'Bad Request',
      });
  });

  it('/posts/id patch - 성공', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    data.title = 'title2';
    data.content = 'content2';

    await request(app.getHttpServer()).patch('/posts/1').send(data).expect({
      statusCode: 200,
      message: '게시물 수정에 성공하였습니다.',
    });
  });

  it('/posts/id patch - 성공 title만 있는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    delete data.content;

    await request(app.getHttpServer()).patch('/posts/1').send(data).expect({
      statusCode: 200,
      message: '게시물 수정에 성공하였습니다.',
    });
  });

  it('/posts/id patch - 성공 content만 있는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    delete data.title;

    await request(app.getHttpServer()).patch('/posts/1').send(data).expect({
      statusCode: 200,
      message: '게시물 수정에 성공하였습니다.',
    });
  });

  it('/posts/id patch - 실패 비밀번호가 다른 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    data.password = '1234567';

    await request(app.getHttpServer()).patch('/posts/1').send(data).expect({
      statusCode: 400,
      message: '비밀번호가 다릅니다.',
      error: 'Bad Request',
    });
  });

  it('/posts/id patch - 실패 비밀번호가 없는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    data.password = '';

    await request(app.getHttpServer())
      .patch('/posts/1')
      .send(data)
      .expect({
        statusCode: 400,
        message: [
          '비밀번호는 숫자가 포함되어야합니다.',
          '비밀번호는 최소 6자입니다.',
        ],
        error: 'Bad Request',
      });
  });

  it('/posts/id patch - 실패 제목 20자 넘음', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    data.title = '123123123123123123123123123123123123123123123123';

    await request(app.getHttpServer())
      .patch('/posts/1')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['제목은 최대 20자입니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts/id patch - 실패 본문이 200자 넘음', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);
    data.content =
      'contentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentcontentconte';

    await request(app.getHttpServer())
      .patch('/posts/1')
      .send(data)
      .expect({
        statusCode: 400,
        message: ['본문은 최대 200자입니다.'],
        error: 'Bad Request',
      });
  });

  it('/posts/id patch - 경로가 없는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);

    await request(app.getHttpServer()).patch('/posts/2').send(data).expect({
      statusCode: 404,
      message: '경로가 잘못되었습니다.',
      error: 'Not Found',
    });
  });

  it('/posts/id delete - 성공', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);

    await request(app.getHttpServer())
      .delete('/posts/1')
      .send({ password: 123456 })
      .expect({
        statusCode: 200,
        message: '게시물 삭제에 성공하였습니다.',
      });
  });

  it('/posts/id delete - 실패 비밀번호가 다른 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);

    await request(app.getHttpServer())
      .delete('/posts/1')
      .send({ password: 1234567 })
      .expect({
        statusCode: 400,
        message: '비밀번호가 다릅니다.',
        error: 'Bad Request',
      });
  });

  it('/posts/id delete - 실패 경로가 없는 경우', async () => {
    const data = {
      title: 'title',
      content: 'content',
      password: '123456',
    };
    const post = postRepository.create(data);
    await postRepository.save(post);

    await request(app.getHttpServer())
      .delete('/posts/2')
      .send({ password: 1234567 })
      .expect({
        statusCode: 404,
        message: '경로가 잘못되었습니다.',
        error: 'Not Found',
      });
  });

  it('/posts/id get - 성공', async () => {
    const data = {
      id: 0,
      title: 'title',
      content: 'content',
      password: '123456',
      createdAt: '',
    };
    const post = postRepository.create({
      title: 'title',
      content: 'content',
      password: '123456',
    });
    await postRepository.save(post);
    delete data.password;
    data.id = post.id;
    data.createdAt = post.createdAt.toISOString();

    await request(app.getHttpServer()).get('/posts/1').expect({
      statusCode: 200,
      data,
    });
  });

  it('/posts/id get - 실패 경로가 없는 경우', async () => {
    await request(app.getHttpServer()).get('/posts/1').expect({
      statusCode: 404,
      message: '경로가 잘못되었습니다.',
      error: 'Not Found',
    });
  });

  it('/posts get - 최신 성공 20개 ', async () => {
    const result = [];
    for (let idx = 0; idx < 20; idx++) {
      const post = postRepository.create({
        title: `title${idx}`,
        content: `content${idx}`,
        password: '123456',
      });
      await postRepository.save(post);
      const { title, content, createdAt, id } = { ...post };
      const created = createdAt.toISOString();
      result.push({ id, title, content, createdAt: created });
    }
    result.reverse();

    const response = await request(app.getHttpServer()).get('/posts');

    expect(response.body.statusCode).toEqual(200);
    for (let idx = 0; idx < 20; idx++) {
      expect(response.body.data[idx]).toEqual(result[idx]);
    }
  });

  it('/posts get - 최신 성공 20개 후 다시 이전 20개 로딩 확인', async () => {
    const result = [];
    for (let idx = 0; idx < 40; idx++) {
      const post = postRepository.create({
        title: `title${idx}`,
        content: `content${idx}`,
        password: '123456',
      });
      await postRepository.save(post);
      const { title, content, createdAt, id } = { ...post };
      const created = createdAt.toISOString();
      result.push({ id, title, content, createdAt: created });
    }
    result.reverse();
    let response = await request(app.getHttpServer()).get('/posts');

    expect(response.body.statusCode).toEqual(200);
    for (let idx = 0; idx < 20; idx++) {
      expect(response.body.data[idx]).toEqual(result[idx]);
    }

    response = await request(app.getHttpServer())
      .get('/posts')
      .query('offset=20');
    expect(response.body.statusCode).toEqual(200);

    for (let idx = 0; idx < 20; idx++) {
      expect(response.body.data[idx]).toEqual(result[idx + 20]);
    }
  });
});
