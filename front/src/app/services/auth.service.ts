import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_TOKEN } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService
    ) { }

  isAuthenticated(): boolean {
	  const accessToken = localStorage.getItem(JWT_TOKEN);
	  return !this.jwtHelper.isTokenExpired(accessToken);
	}

   getLoggedInUser(): string {
    const token = localStorage.getItem(JWT_TOKEN);
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.username;
    }
    return "";
  }

  clearToken(): void {
    localStorage.removeItem(JWT_TOKEN);
  }

  logout(): void {
    this.clearToken();
  }
 

}
