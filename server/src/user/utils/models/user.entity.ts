import { MessageEntity } from "src/chat/utils/models/message.entity"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    ft_id:number

    @Column()
    username:string

    @Column()
    email:string

    @Column()
    tfa_secret:string

    @Column()
    is_tfa_enable:boolean

    @Column()
    avatar:string

    @Column()
    status:string

    @CreateDateColumn()
    created_at:Date

    @CreateDateColumn()
    updated_at:Date
}
