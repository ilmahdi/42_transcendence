
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id?:number

    @PrimaryGeneratedColumn()
    channel_id?:number

    @Column({default: ""})
    text_message?:string

    @CreateDateColumn()
    sent_at?:Date

    @Column()
    author?:number

    // @ManyToOne(() => User, (userEntity) => userEntity.message)
    // author:User;
}
