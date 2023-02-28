import { Length } from 'class-validator';

export class UsersToConversationDto {
  @Length(15, 20, { each: true })
  userIds: string[];
}
