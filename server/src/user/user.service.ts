import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Profile } from "src/auth/utils/interfaces";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./utils/dtos/update-user.dto";
import { CreateUserDto } from "./utils/dtos/create-user.dto";
import { TokenService } from "src/common/services/token.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private tokenService: TokenService,
        ){
    }

    async findUserById(id: number) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                id,
            },
        })
        return user;
    }
    async findUserByFtId(id: number) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                ft_id: id,
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
    async addUser(createUserDto: CreateUserDto) {
        const user = await this.prismaService.userAccount.create({
            data: {
                ...createUserDto,
            }

        })
        return user;
    }
    async updateUserData (id :number, updateUserDto :UpdateUserDto) {
        const updatedUser = await this.prismaService.userAccount.update({
            where: { id },
            data: updateUserDto,
        });
        return updatedUser;
    }
    async registerUser(createUserDto :CreateUserDto) {

        let user = await this.findUserByFtId(createUserDto.ft_id);

        if (user) 
            throw new HttpException('User is already exist', HttpStatus.CONFLICT);

        user = await this.findUserByUsername(createUserDto.username);

        if (user) 
            throw new HttpException('Username is already in use', HttpStatus.CONFLICT);

        try {

            const user = await this.addUser(createUserDto);
            const token = this.tokenService.generateToken(
                {
                    sub: user.id,
                    username: user.username,
                }
            )
            // console.log(token)
            return { token };

        } catch(error) {
            throw new HttpException('Failed to update user', HttpStatus.CONFLICT);
        }
        
  }
    async updateUser(id :number, updateUserDto :UpdateUserDto) {

        let user = await this.findUserById(id);

        if (!user) 
        throw new HttpException('User not found', HttpStatus.CONFLICT);

        user = await this.findUserByUsername(updateUserDto.username);

        if (user && user.id != id ) 
            throw new HttpException('Username is already in use', HttpStatus.CONFLICT);

        try {

            const user = await this.updateUserData(id, updateUserDto);
            const token = this.tokenService.generateToken(
                {
                    sub: user.id,
                    username: user.username,
                }
            )
            // console.log(token)
            return { token };
        } catch(error) {
            throw new HttpException('Failed to update user', HttpStatus.CONFLICT);
        }
        
  }


}