import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JWT_TOKEN } from '../utils/constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuBarService {

  iShowLeftBar :boolean = false;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  searchUsers(searchQuery :string ) : Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/user/search?q=${searchQuery}`,this.getHeaders())
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
}
