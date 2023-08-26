import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDto } from "./utils/dtos/update-user.dto";
import { CreateUserDto } from "./utils/dtos/create-user.dto";
import { TokenService } from "src/common/services/token.service";
import { FrinedshipDto } from "./utils/dtos/friendship.dto";
import { FriendshipStatus } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
        private tokenService: TokenService,
    ) {
    }

    async findUserById(id: number) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                id,
            },
        })
        return user;
    }
    // async findUserByFtId(id: number) {
    //     const user = await this.prismaService.userAccount.findUnique({
    //         where: {
    //             // original auth
    //             // ft_id: id,
    //             id: id,
    //             // 
    //         },
    //     })
    //     return user;
    // }
    async findUserByUsername(username: string) {
        const user = await this.prismaService.userAccount.findUnique({
            where: {
                username,
            },
        })
        return user;
    }
    async findManyUsers(query: string) {
        const users = await this.prismaService.userAccount.findMany({
            select: {
                username: true,
                avatar: true,
            },
            take: 13,
            where: {
                username: {
                    startsWith: query,
                }
            },
        })
        return users;
    }
    async addUser(createUserDto: CreateUserDto) {
        const user = await this.prismaService.userAccount.create({
            data: {
                ...createUserDto,
            }

        })
        return user;
    }
    async updateUserData(id: number, updateUserDto: UpdateUserDto) {
        const updatedUser = await this.prismaService.userAccount.update({
            where: { id },
            data: updateUserDto,
        });
        return updatedUser;
    }
    async registerUser(createUserDto: CreateUserDto) {
        // original auth

        // let user = await this.findUserByFtId(createUserDto.ft_id);
        // if (user) 
        //     throw new HttpException('User is already exist', HttpStatus.CONFLICT);

        //

        const user = await this.findUserByUsername(createUserDto.username);

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

        } catch (error) {
            throw new HttpException('Failed to update user', HttpStatus.CONFLICT);
        }

    }
    async updateUser(id: number, updateUserDto: UpdateUserDto) {

        let user = await this.findUserById(id);

        if (!user)
            throw new HttpException('User not found', HttpStatus.CONFLICT);

        user = await this.findUserByUsername(updateUserDto.username);

        if (user && user.id != id)
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
        } catch (error) {
            throw new HttpException('Failed to update user', HttpStatus.CONFLICT);
        }

    }
    async searchUsers(query: string) {
        const users = await this.findManyUsers(query)

        return users;
    }

    async addFriend(friendship: FrinedshipDto) {
        const existingFriendship = await this.checkFriendship(friendship)

        if (existingFriendship) {
            throw new HttpException('Friendship already exists', HttpStatus.CONFLICT);
        }

        const friendshipData = await this.prismaService.friendship.create({
            data: {
                user_id: friendship.user_id,
                friend_id: friendship.friend_id,
                friendship_status: friendship.friendship_status,
            },
        });
        return friendshipData;
    }
    async checkFriendship(friendship: FrinedshipDto) {
        const existingFriendship = await this.prismaService.friendship.findFirst({
            where: {
                OR: [
                    {
                        user_id: friendship.user_id,
                        friend_id: friendship.friend_id,
                    },
                    {
                        user_id: friendship.friend_id,
                        friend_id: friendship.user_id,
                    },
                ],
            },
        });
        return existingFriendship;
    }
    async deleteFriendship(friendshipId :number) {

        const existingFriendship = await this.prismaService.friendship.findUnique({
            where: {
              id: friendshipId,
            },
        })

        if (!existingFriendship) {
            throw new HttpException('Friendship not found', HttpStatus.CONFLICT);
        }
        
        return await this.prismaService.friendship.delete({
            where: {
              id: friendshipId,
            },
          });
    }
    async changeFriendshipStatus(friendshipId :number, friendshipStatus: FriendshipStatus) {

        const existingFriendship = await this.prismaService.friendship.findUnique({
            where: {
              id: friendshipId,
            },
        })

        if (!existingFriendship) {
            throw new HttpException('Friendship not found', HttpStatus.CONFLICT);
        }
        
        const updatedFriendship = await this.prismaService.friendship.update({
            where: { 
                id: friendshipId 
            },
            data: { 
                friendship_status: friendshipStatus,
            },
          });

        return updatedFriendship
    }
    async updateFriend(friendshipId :number, friendship: FrinedshipDto) {

        const existingFriendship = await this.prismaService.friendship.findUnique({
            where: {
              id: friendshipId,
            },
        })

        if (!existingFriendship) {
            throw new HttpException('Friendship not found', HttpStatus.CONFLICT);
        }
        
        const updatedFriendship = await this.prismaService.friendship.update({
            where: { 
                id: friendshipId 
            },
            data: { 
                ...friendship,
            },
          });

        return updatedFriendship
    }

}