import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../components/utils/constants';
import { UserData } from '../components/utils/interfaces/user-data.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  private apiUrl = environment.apiUrl;


  getUserData () : Observable<UserData> {
    const accessToken = localStorage.getItem(JWT_TOKEN);
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.http.get<UserData>(`${this.apiUrl}/user/me` ,{ headers });
  }


}
