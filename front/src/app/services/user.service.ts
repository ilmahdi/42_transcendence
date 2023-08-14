import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { IUserData, IUserDataShort } from '../utils/interfaces/user-data.interface';
import { Observable } from 'rxjs';

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

  uploadImage (formData :FormData) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/avatar/upload`, formData ,this.getHeaders());
  }
  updateUserData (userDataShort :IUserDataShort) : Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/${userDataShort.id}`, userDataShort ,this.getHeaders());
  }


  // private functions
  /*********************************************/
  private getHeaders(){
    const accessToken = localStorage.getItem(JWT_TOKEN);
    const headers = { Authorization: `Bearer ${accessToken}` };
    return { headers };
  }

}
