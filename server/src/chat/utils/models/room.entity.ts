
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    adminId?:number;

    // @Column()
    // messages?:string[]
    // messages?: {message:string, date:Date}[];

    @Column()
    usersId?:number[]
}
