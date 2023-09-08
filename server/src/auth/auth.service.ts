import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Observable, catchError, from, map, of, retry, switchMap } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/utils/models/user.class';


@Injectable()
export class AuthService {
    constructor(
        // @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
        private prismaService: PrismaService,
        private jwtService: JwtService
        ){
    }

    getAllUsers() {
        return from(this.prismaService.user.findMany())
    }
    
    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User> {
        const {firstName, lastName, email, password, imagePath} = user;
        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) => {
                return from(this.prismaService.user.create({data:{firstName, lastName, email, password: hashedPassword, imagePath}}))
                .pipe(map((user:User) => {delete user.password; return user}))
            })
        )
    }

    validaorUser(email:string, password:string):Observable<User> {
        return from(this.prismaService.user.findFirst({
            where:{email}
        }))
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
        return from(this.jwtService.verify(jwt)).pipe(
          map(({ user }: { user: User }) => {
            return user;
          }),
          catchError(() => {
            return of(null);
          }),
        );
      }

}