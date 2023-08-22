import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { IUserData, IUserDataShort } from '../utils/interfaces/user-data.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { IHistory } from '../utils/interfaces/history.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = environment.apiUrl;


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
