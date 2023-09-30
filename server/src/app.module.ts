import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';


import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {

        // console.log(error)
            
        throw new HttpException('conflict', HttpStatus.CONFLICT);
      }),
    );
  }
}
 
@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    UserModule, PrismaModule, AuthModule, ChatModule, GameModule,
  ],
  controllers: [],
  providers: [PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
