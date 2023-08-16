

import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { MessageEntity } from '../../../chat/utils/models/message.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  // @Column({default: null})
  // socketId?:string;

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
}
