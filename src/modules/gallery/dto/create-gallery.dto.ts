import { ArrayNotEmpty, ArrayUnique, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateGalleryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  tags: string[];
}
