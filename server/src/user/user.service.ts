import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "./utils/models/user.class";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./utils/models/user.entity";
import { Repository } from "typeorm";

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

}