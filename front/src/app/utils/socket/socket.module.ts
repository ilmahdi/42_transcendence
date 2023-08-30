import { Injectable, NgModule } from '@angular/core';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { JWT_TOKEN } from '../constants';
import { environment } from 'src/environments/environment';


function getToken() {

  const token = localStorage.getItem(JWT_TOKEN);
  if (token)
    return token
  return "";
}


@Injectable()
export class CustomSocket extends Socket {
  constructor() {
    super({ url: environment.apiUrl });
  }

  setToken() : boolean{
    const token = localStorage.getItem(JWT_TOKEN);

    if (!token) {
      this.ioSocket.disconnect();
      return false;
    }
    
    else {
      this.ioSocket.io.opts.extraHeaders = {
        Authorization: localStorage.getItem(JWT_TOKEN),
      };
      
      this.ioSocket.disconnect();
      this.ioSocket.connect();
      return true;
    }
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
