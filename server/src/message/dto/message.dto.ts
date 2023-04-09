import { IsNotEmpty, IsString, IsIn, MaxLength, IsUUID } from 'class-validator';

export class MessageDto {
  @IsUUID('all')
  id: string;

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
