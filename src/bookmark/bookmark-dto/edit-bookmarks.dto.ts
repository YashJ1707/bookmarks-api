import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class EditBookmarkDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  link: string;
  @IsString()
  @IsOptional()
  description?: string;
}
