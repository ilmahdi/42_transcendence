import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { HttpClient } from '@angular/common/http';
import { CustomSocket } from '../utils/socket/socket.module';
import { INotification, INotifyData, NotificationType } from '../utils/interfaces/notify-data.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuBarService {

  iShowLeftBar :boolean = false;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private socket: CustomSocket,
  ) {
  }

  // http handlers
  /*********************************************/
  searchUsers(searchQuery :string ) : Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/api/user/search?q=${searchQuery}`,this.getHeaders())
    .pipe(
      catchError( error => {
        return throwError(() => error);
      })
    );
  }

  getNotifications(userId :number) {

    return this.http.get<INotifyData[]>(`${this.apiUrl}/api/user/notify/data/${userId}` ,this.getHeaders());
  }
  addNotification(notification :INotification) {

    return this.http.post<any>(`${this.apiUrl}/api/user/notify/add`, notification ,this.getHeaders());
  }
  switchNotification(notification :INotification) {

    return this.http.post<any>(`${this.apiUrl}/api/user/notify/switch`, notification ,this.getHeaders());
  }
  deleteNotification(notification :INotification) {

    return this.http.patch<any>(`${this.apiUrl}/api/user/notify/delete`, notification ,this.getHeaders());
  }
  deleteNotifications(notifications :number[]) {

    return this.http.patch<any>(`${this.apiUrl}/api/user/notify/deletes`, notifications ,this.getHeaders());
  }

  


  // socket handler
  /*********************************************/

  sendEvent(eventName: string, data :any) {
    this.socket.emit(eventName, data);
  }



  // private functions
  /*********************************************/
  private getHeaders(){
    const accessToken = localStorage.getItem(JWT_TOKEN);
    const headers = { Authorization: `Bearer ${accessToken}` };
    return { headers };
  }
}
