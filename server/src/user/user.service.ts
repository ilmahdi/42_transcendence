import { Injectable } from "@nestjs/common";
import { Profile } from "src/auth/utils/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./utils/dtos/update-user.dto";

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
    async addUser(profile: Profile) {
        const user = await this.prismaService.userAccount.create({
            data: {
                ...profile,
            }

        })
        return user;
    }
    async getUserInfo () {
        
    }
    async updateUser(id :number, updateUserDto :UpdateUserDto) {

    const user = await this.findUserById(id);

    if (!user) 
      throw new Error('User not found');
    console.log("=>>>>>>>>", updateUserDto);
    const updatedUser = await this.prismaService.userAccount.update({
      where: { id },
      data: updateUserDto,
    });

    return updatedUser;
  }


}