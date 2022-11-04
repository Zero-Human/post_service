import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePost {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  title: string;

  @IsOptional()
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
