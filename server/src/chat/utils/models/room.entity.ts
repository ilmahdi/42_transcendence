
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

    @Column({default:'Room'})
    name?:string;

    @Column('integer', { array: true, default: [] })
    usersId?:number[];

    @Column({default: 'default.png'})
    imagePath?:string;
}
