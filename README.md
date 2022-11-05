# post_service
## 프로젝트 개요

**게시판 Rest API 입니다.**

> 게시판 CRUD 프로젝트입니다.<br>
> 제목과 본문에 이모지를 추가할 수 있고 비밀번호는 암호화하여 저장합니다.<br>
> 조건:
> 제목의 길이는 최대 20자, 본문의 길이는 최대 200자, 비밀번호는 1개 이상의 숫자 및 최소6자입니다.
> 목록조회할 때 20개씩 조회가능합니다.


## 기술 스택
- Framework: nest.js
- ORM : typeorm
- DB : mysql


## DB Modeling
<img width="530" alt="스크린샷 2022-11-05 오후 6 55 21" src="https://user-images.githubusercontent.com/70467297/200114110-38f51a60-3368-4270-b9b6-aa9a803552ff.png">



## API 문서

| 기능구분  | 기능  | Method | URL | 
| ------------- | ------------- | ------------- | ------------- | 
| Post | 게시글 생성 | POST | /posts  |                 
|  | 게시글 수정 | PATCH | /posts/:id  | 
|  | 게시글 삭제 | DELETE  | /posts/:id  |
|  | 게시글 목록 조회 | GET | /posts  | 
|  | 게시글 상세 조회 | GET  | /posts/:id |

 > 게시글 목록 조회 쿼리파라미터는 offset이고 오프셋부터 20개의 게시글을 조회 / offset이 없어도 됨
```
Request ex)
body
{
  title : "title",
  content : "content",
  password : "1password"
}
```
```
Response ex)
body
{
  statusCode: 201,
  message: '게시물 생성에 성공하였습니다.',
}
or
body
{
  statusCode: 200,
  data,
}
목록 상세 조회일경우
data: 
{
  "id": 1,
  "title": "title",
  "content": "content",
  "createdAt": "2022-11-05T10:32:21.215Z"
}
목록 조회일경우
data: 
[
  {
      "id": 3,
      "title": "title3",
      "content": "content3",
      "createdAt": "2022-11-05T10:34:30.997Z"
  },
  {
      "id": 2,
      "title": "title2",
      "content": "content2",
      "createdAt": "2022-11-05T10:34:25.973Z"
  }
  ...
]
```
## 구현 기능 관련

게시글 생성 : 제목 ,본문 비밀번호가 있어야 하고 이모지를 추가할 수 있습니다.<br>
게시글 수정 : 비밀번호가 맞으면 제목 또는 본문이 있어야하고 이모지를 추가할 수 있습니다.<br>
게시글 삭제 : 비밀번호가 맞으면 게시글 삭제 기능합니다.<br>
게시글 목록 조회 : 최신글 기준으로 20개를 조회하고 offset쿼리파라미터가 있으면 offest 기준 20개를 조회 가능합니다.<br>
게시글 상세 조회 : 게시글 내용을 보여줍니다.

> 게시글 조건 : 제목의 길이는 최대 20자, 본문의 길이는 최대 200자, 비밀번호는 1개 이상의 숫자 및 최소6자입니다.

## Test 결과

<img width="600" alt="스크린샷 2022-11-05 오후 6 57 56" src="https://user-images.githubusercontent.com/70467297/200114197-e37961fa-bc6f-4756-8374-c59c3d1ad816.png">

## 설치 및 실행 방법
nodejs와 npm이 install 되어있지 않다면 먼저 install 과정 진행
<details>
    <summary> 프로젝트 설치 밀 실행 과정</summary>

<b>1. 프로젝트 clone 및 디렉토리 이동</b>
```bash
git clone hhttps://github.com/Zero-Human/post_service.git

```
<b>2. .env.dev 파일 생성</b>
```bash
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_HOST=
DB_SCHEMA=
SYNCHRONIZE = 
LOGGING = 
CHARSET = 
TIMEZONE=
```
<b>3. node package 설치</b>
```javascript
npm install
```
<b>4. 서버 실행</b>
```javascript
npm start
```
</details>

<details>
    <summary>Test 실행 방법</summary>
    
<b>1. .env.test 파일 생성</b>
```bash
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_HOST=
DB_SCHEMA=
SYNCHRONIZE = 
LOGGING = 
CHARSET = 
TIMEZONE=
```
<b>2. test 실행</b>
```javascript
npm run test:e2e
```
</details>



