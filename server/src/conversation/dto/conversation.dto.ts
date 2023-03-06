import { ArrayMaxSize, ArrayMinSize, Length } from 'class-validator';

export class UsersToConversationDto {
  @Length(15, 20, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  userIds: string[];
}
