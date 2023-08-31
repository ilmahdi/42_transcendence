import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_TOKEN } from '../utils/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public jwtHelper: JwtHelperService
    ) { }

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


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
 

}
