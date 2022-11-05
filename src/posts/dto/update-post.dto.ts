import {
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePost {
  @IsOptional()
  @IsNotEmpty({
    message: '제목은 내용이 있어야합니다.',
  })
  @MaxLength(20, {
    message: '제목은 최대 20자입니다.',
  })
  title: string;

  @IsOptional()
  @IsNotEmpty({
    message: '본문은 내용이 있어야합니다.',
  })
  @MaxLength(200, {
    message: '본문은 최대 200자입니다.',
  })
  content: string;

  @MinLength(6, {
    message: '비밀번호는 최소 6자입니다.',
  })
  @Matches(/\d+/, {
    message: '비밀번호는 숫자가 포함되어야합니다.',
  })
  password: string;
}
