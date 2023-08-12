import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { Observable, catchError, from, map, of, retry, switchMap } from 'rxjs';
import { brotliCompress } from 'zlib';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';
import { UserEntity } from 'src/user/utils/models/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/utils/models/user.class';


@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>, private jwtService: JwtService){
    }

    getAllUsers() {
        return from(this.userRepository.find())
    }
    
    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User> {
        const {firstName, lastName, email, password} = user;
        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from(this.userRepository.save({firstName, lastName, email, password: hashedPassword}))
                .pipe(map((user:User) => {delete user.password; return user}))
            })
        )
    }

    validaorUser(email:string, password:string):Observable<User> {
        return from(this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne());
    }

    login(user:User):Observable<string> {
        const {email, password} = user;
        return this.validaorUser(email, password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return from(this.jwtService.signAsync({user}))
                }
            })
        )
    }

    getJwtUser(jwt: string): Observable<User | null> {
        return from(this.jwtService.verifyAsync(jwt)).pipe(
          map(({ user }: { user: User }) => {
            return user;
          }),
          catchError(() => {
            return of(null);
          }),
        );
      }

}