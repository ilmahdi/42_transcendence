import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { IUserData, IUserDataShort } from '../utils/interfaces/user-data.interface';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { IHistory } from '../utils/interfaces/history.interface';
import { IFriendship } from '../utils/interfaces/friendship.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = environment.apiUrl;


  // http handlers
  /*********************************************/
  getUserData () : Observable<IUserData> {
    return this.http.get<IUserData>(`${this.apiUrl}/api/user/me` ,this.getHeaders());
  }
  getUserDataShort () : Observable<IUserDataShort> {
    return this.http.get<IUserDataShort>(`${this.apiUrl}/api/user/short` ,this.getHeaders());
  }
  getUserDataShort2 (userId :number) : Observable<IUserDataShort> {
    return this.http.get<IUserDataShort>(`${this.apiUrl}/api/user/short-data/${userId}` ,this.getHeaders());
  }
  getUserDataByUsername (username :string) : Observable<IUserData> {
    return this.http.get<IUserData>(`${this.apiUrl}/api/user/data/${username}` ,this.getHeaders());
  }

  getfriendList (userId :number) : Observable<IUserDataShort[]> {
    return this.http.get<IUserDataShort[]>(`${this.apiUrl}/api/user/friend-list/${userId}` ,this.getHeaders());
  }
  getAllUsers () : Observable<IUserDataShort[]> {
    return this.http.get<IUserDataShort[]>(`${this.apiUrl}/api/user/all-users` ,this.getHeaders());
  }

  uploadImage (formData :FormData) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/avatar/upload`, formData ,this.getHeaders());
  }
  registerUser (userDataShort :IUserDataShort) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/register`, userDataShort ,this.getHeaders())
    .pipe(
      catchError( error => {
        return throwError(() => error);
      })
    );
  }
  updateUserData (userDataShort :IUserDataShort) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/user/update/${userDataShort.id}`, userDataShort ,this.getHeaders())
    .pipe(
      catchError( error => {
        return throwError(() => error);
      })
    );
  }

  addFriend (friendship :IFriendship) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/friends/add`, friendship ,this.getHeaders());
  }
  updateFriend (frinedship_id :number, friendship :IFriendship) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/user/friends/update/${frinedship_id}`, friendship ,this.getHeaders());
  }
  checkFriendship (friendship :IFriendship) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/friends/check`, friendship ,this.getHeaders());
  }
  cancelFriend (frinedship_id :number) : Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/user/friends/cancel/${frinedship_id}` ,this.getHeaders());
  }
  changeFriendshipStatus (frinedship_id :number, friendshipStatus :string) : Observable<any> {
    return this.http.post<any>(
          `${this.apiUrl}/api/user/friends/change/${frinedship_id}`, 
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
    return this.http.get<IHistory[]>(`${this.apiUrl}/api/game/history` ,this.getHeaders());
  }
}
