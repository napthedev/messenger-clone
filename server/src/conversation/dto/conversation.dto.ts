import { IsNotEmpty, IsString } from 'class-validator';

export class UsersToConversationDto {
  @IsString()
  @IsNotEmpty()
  otherUserId: string;
}
