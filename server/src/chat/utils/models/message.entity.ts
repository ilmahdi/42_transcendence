
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  senderId?:number;

  @Column()
  receiverId?:number

  @Column()
  message?: string;

  @Column()
  date?:Date;

  @Column({default:false})
  readed?:boolean
}
