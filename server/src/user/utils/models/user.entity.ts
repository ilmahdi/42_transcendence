

import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { ConversationEntity } from '../../../chat/utils/models/conversation.entity';
import { MessageEntity } from '../../../chat/utils/models/message.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  password?: string;

  @Column({ nullable: true })
  imagePath?: string;

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations?: ConversationEntity[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.user)
  messages?: MessageEntity[];
}
