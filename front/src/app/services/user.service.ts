import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { IUserData, IUserDataShort } from '../utils/interfaces/user-data.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { IHistory } from '../utils/interfaces/history.interface';
import { IFrinedship } from '../utils/interfaces/friendship.interface';
import { CustomSocket } from '../utils/socket/socket.module';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private socket: CustomSocket,
  ) { }

  private apiUrl = environment.apiUrl;

  // http handlers
  /*********************************************/
  getUserData () : Observable<IUserData> {
    return this.http.get<IUserData>(`${this.apiUrl}/user/me` ,this.getHeaders());
  }
  getUserDataByUsername (username :string) : Observable<IUserData> {
    return this.http.get<IUserData>(`${this.apiUrl}/user/data/${username}` ,this.getHeaders());
  }

  uploadImage (formData :FormData) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/avatar/upload`, formData ,this.getHeaders());
  }
  registerUser (userDataShort :IUserDataShort) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, userDataShort ,this.getHeaders())
    .pipe(
      catchError( error => {
        return throwError(() => error);
      })
    );
  }
  updateUserData (userDataShort :IUserDataShort) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/update/${userDataShort.id}`, userDataShort ,this.getHeaders())
    .pipe(
      catchError( error => {
        return throwError(() => error);
      })
    );
  }

  addFriend (friendship :IFrinedship) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/friends/add`, friendship ,this.getHeaders());
  }
  updateFriend (frinedship_id :number, friendship :IFrinedship) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/friends/update/${frinedship_id}`, friendship ,this.getHeaders());
  }
  checkFriendship (friendship :IFrinedship) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/friends/check`, friendship ,this.getHeaders());
  }
  cancelFriend (frinedship_id :number) : Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/friends/cancel/${frinedship_id}` ,this.getHeaders());
  }
  changeFriendshipStatus (frinedship_id :number, friendshipStatus :string) : Observable<any> {
    return this.http.post<any>(
          `${this.apiUrl}/user/friends/change/${frinedship_id}`, 
          {friendshipStatus} ,this.getHeaders(),
      );
  }

  // socket handler
  /*********************************************/





  // private functions
  /*********************************************/
  private getHeaders(){
    const accessToken = localStorage.getItem(JWT_TOKEN);
    const headers = { Authorization: `Bearer ${accessToken}` };
    return { headers };
  }
  
  
  
  
  // temporary 
  /*********************************************/
  getMatchHistory (username :string) : Observable<IHistory[]> {
    return this.http.get<IHistory[]>(`${this.apiUrl}/tmp/history` ,this.getHeaders());
  }
}
