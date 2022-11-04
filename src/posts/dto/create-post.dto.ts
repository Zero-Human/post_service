import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePost {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/\d+/)
  password: string;
}
