
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   ManyToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { RoomType } from './roomType.enum';

// @Entity('rooms')
// export class RoomEntity {
//     @PrimaryGeneratedColumn()
//     id?: number;

//     @Column('integer', { array: true, default: [] })
//     adminId?:number[];

//     @Column({default:'Room'})
//     name?:string;

//     @Column('integer', { array: true, default: [] })
//     usersId?:number[];

//     @Column({default: RoomType.PUBLIC})
//     type?:RoomType;

//     @Column({default: null})
//     password?:string;

//     @Column({default: 'default.png'})
//     imagePath?:string;
// }
