import { Injectable } from '@nestjs/common';
import { Profile } from './utils/interfaces'
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/common/services/token.service';


@Injectable()
export class AuthService {
    constructor(
            private readonly userService: UserService,
            private tokenService: TokenService,
        ){
    }

    async validateFtUser(profile: Profile){
        let firstLogin :string = "false";
        // original auth
        // let user = await this.userService.findUserByFtId(profile.ft_id);
        let user = await this.userService.findUserByUsername(profile.username);
        // 
        if (!user)
        {
            // user = await this.userService.addUser(profile);
            firstLogin = "true";
            return { profile, firstLogin }
        }
        const token =  this.tokenService.generateToken(
            {
                sub: user.id,
                username: user.username,
            }
        )
        return { token, firstLogin }
    }

    async twofaCheck(userId :number) {
        return await this.userService.twofaCheck(userId);
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