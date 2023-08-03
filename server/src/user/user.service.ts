import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService){
    }

    async findUserById(id: number) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                id,
            },
        })
        return user;
    }
    async findUserByUsername(username: string) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                username,
            },
        })
        return user;
    }

}