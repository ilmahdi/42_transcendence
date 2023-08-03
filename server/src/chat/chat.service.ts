import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './utils/dtos/update-chat.dto';
import { MessageEntity } from './utils/models/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ConversationEntity } from './utils/models/conversation.entity';
import { ActiveConversationEntity } from './utils/models/active-conversation.entity';
import { Observable, from, map, mergeMap, of, switchMap, take } from 'rxjs';
import { Conversation } from './utils/models/conversation.interface';
import { UserEntity } from 'src/user/utils/models/user.entity';
import { ActiveConversation } from './utils/models/active-conversation.interface';

@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ActiveConversationEntity)
    private readonly activeConversationRepository: Repository<ActiveConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  createMessage(message: MessageEntity): Observable<MessageEntity> {
    console.log(message);
    
    return from(this.messageRepository.save(message));
  }

  getConversation(
    creatorId: number,
    friendId: number,
  ): Observable<Conversation | undefined> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :creatorId', { creatorId })
        .orWhere('user.id = :friendId', { friendId })
        .groupBy('conversation.id')
        .having('COUNT(*) > 1')
        .getOne(),
    ).pipe(map((conversation: Conversation) => conversation || undefined));
  }

  createConversation(creator: UserEntity, friend: UserEntity): Observable<Conversation> {
    return this.getConversation(creator.id, friend.id).pipe(
      switchMap((conversation: Conversation) => {
        const doesConversationExist = !!conversation;
        if (!doesConversationExist) {
          const newConversation: Conversation = {
            users: [creator, friend],
          };
          return from(this.conversationRepository.save(newConversation));
        }
        return of(conversation);
      }),
    );
  }



  getConversationsForUser(userId: number): Observable<Conversation[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .leftJoin('conversation.users', 'user')
        .where('user.id = :userId', { userId })
        .orderBy('conversation.lastUpdated', 'DESC')
        .getMany(),
    );
  }

  getConversationsWithUsers(userId: number): Observable<Conversation[]> {
    return this.getConversationsForUser(userId).pipe(
      take(1),
      switchMap((conversations: Conversation[]) => conversations),
      mergeMap((conversation: Conversation) => {
        return this.getUsersInConversation(conversation.id);
      }),
    );
  }

  getActiveUsers(conversationId: number): Observable<ActiveConversation[]> {
    return from(
      this.activeConversationRepository.find({
        where: [{ conversationId }],
      }),
    );
  }

  getUsersInConversation(conversationId: number): Observable<Conversation[]> {
    return from(
      this.conversationRepository
        .createQueryBuilder('conversation')
        .innerJoinAndSelect('conversation.users', 'user')
        .where('conversation.id = :conversationId', { conversationId })
        .getMany(),
    );
  }

  getMessages(conversationId: number): Observable<MessageEntity[]> {
    return from(
      this.messageRepository
        .createQueryBuilder('message')
        .innerJoinAndSelect('message.user', 'user')
        .where('message.conversation.id =:conversationId', { conversationId })
        .orderBy('message.createdAt', 'ASC')
        .getMany(),
    );
  }
}
