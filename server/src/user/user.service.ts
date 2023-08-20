import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "./utils/models/user.class";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./utils/models/user.entity";
import { Repository } from "typeorm";
import { from } from "rxjs";

@Injectable()
export class UserService {
    constructor(
        // private readonly prismaService: PrismaService,
        @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>
        ){
    }

    // async findUserById(id: number) {
    //     const user = await this.prismaService.userAccount.findUnique({
    //         where: {
    //             id,
    //         },
    //     })
    //     return user;
    // }
    // async findUserByUsername(username: string) {
    //     const user = await this.prismaService.userAccount.findUnique({
    //         where: {
    //             username,
    //         },
    //     })
    //     return user;
    // }

    updateUser(userId:number, socketId:string) {
        this.userRepository.update(userId, {socketId})
    }

    getUserById(id:number) {
        try {
            const user = this.userRepository.findOne({
              where: {
                id:id
              }
            });
            return from(user);
        } catch (error) {
            throw new Error('Could not retrieve messages');
        }
    }

}