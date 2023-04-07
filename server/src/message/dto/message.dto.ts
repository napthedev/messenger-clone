import { IsNotEmpty, IsString, IsIn, MaxLength } from 'class-validator';

export class MessageDto {
  @IsIn(['text', 'image'])
  type: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
