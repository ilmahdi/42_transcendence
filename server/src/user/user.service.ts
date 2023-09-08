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
        private readonly prismaService: PrismaService,
        // @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>
        ){
    }

    async updateUser(userId:number, socketId:string) {
        await this.prismaService.user.update({
            where:{id:userId},
            data:{socketId}
        })
    }

    getUserById(id:number) {
        try {
            const user = this.prismaService.user.findFirst({
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