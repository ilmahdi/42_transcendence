import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Message')
export class CreateChatDto {
    @PrimaryGeneratedColumn()
    id:number

    @Column({default: ""})
    body:string

    @CreateDateColumn()
    CreatedAt:Date
}
