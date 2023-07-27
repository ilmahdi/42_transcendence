
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Message')
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id?:number

    @Column({default: ""})
    text_message?:string

    @CreateDateColumn()
    sent_at?:Date

    @Column()
    authorId?:number

    @Column()
    receiverId?:number

    // @ManyToOne(() => User, (userEntity) => userEntity.message)
    // author:User;
}
