import { Injectable, NgModule } from '@angular/core';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { JWT_TOKEN } from '../constants';


function getToken() {

  const token = localStorage.getItem(JWT_TOKEN);
  if (token)
    return token
  return "";
}

@Injectable()
export class CustomSocket extends Socket {
  constructor(private authservice :AuthService) {
    super( { url: 'http://localhost:3000', options: {
      extraHeaders: {
          Authorization: getToken(),
        }
      },
    });
  }

}


@NgModule({
  declarations: [
  ],
  imports: [
    SocketIoModule,
  ],
  providers: [CustomSocket],
})
export class SocketModule { }
