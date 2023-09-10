import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_TOKEN } from '../utils/constants';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUserData } from '../utils/interfaces/user-data.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    ) { }
    
  private apiUrl = environment.apiUrl;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private user$ = new BehaviorSubject<IUserData| null>(null);


  get userId(): Observable<number | undefined> {
    return this.user$.asObservable().pipe(
      switchMap((user: IUserData | null) => {
        return of(user?.id);
      })
    );
  }
  
  setAuthenticated(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }

   getLoggedInUser(): string {
    const token = localStorage.getItem(JWT_TOKEN);
    if (token) {
      return this.getUsernameFromToken(token);
    }
    return "";
  }
   getLoggedInUserId(): number {
    const token = localStorage.getItem(JWT_TOKEN);
    if (token) {
      return +this.getIdFromToken(token);
    }
    return -1;
  }

  clearToken(): void {
    localStorage.removeItem(JWT_TOKEN);
  }

  logout(): void {
    this.clearToken();
  }

  getUsernameFromToken(token :string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.username;
  }
  getIdFromToken(token :string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken.sub;
  }


  checkTwofa (userId :number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/twofa/ckeck/${userId}`, this.getHeaders());
  }

  generateTwoFa (userId :number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/twofa/generate/${userId}`, this.getHeaders());
  }
  enableTwoFa (userId :number, userToken: string) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/twofa/enable/${userId}`, {userToken}, this.getHeaders());
  }
  validateTwoFa (userId :number, userToken: string) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/twofa/validate/${userId}`, {userToken}, this.getHeaders());
  }
  disableTwoFa (userId :number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/auth/twofa/disable/${userId}`, this.getHeaders());
  }
  






  // private functions
  /*********************************************/
  private getHeaders(){
    const accessToken = localStorage.getItem(JWT_TOKEN);
    const headers = { Authorization: `Bearer ${accessToken}` };
    return { headers };
  }

}
