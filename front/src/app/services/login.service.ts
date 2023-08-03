import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map, of, switchMap, take, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { NewUser } from '../models/newUser.model';
import { UserResponse } from '../models/userResponse.model';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private user$ = new BehaviorSubject<User| null>(null);
  
  constructor(private http: HttpClient, private router: Router) { }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    )
  }

  get username(): Observable<string | undefined> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        return of(user?.firstName);
      })
    );
  }

  get userId(): Observable<number | undefined> {
    return this.user$.asObservable().pipe(
      switchMap((user: User | null) => {
        return of(user?.id);
      })
    );
  }

  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          const decodedToken: UserResponse = jwtDecode(response.token);
          this.user$.next(decodedToken.user);
        })
      ) as Observable<{ token: string }>; // Add type assertion here
  }

  isTokenInStorage(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token) {
      return from(of(token)).pipe(
        map((storedToken: string) => {
          const decodedToken: UserResponse = jwtDecode(storedToken);
          const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
          const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
  
          if (isExpired) return false;
  
          if (decodedToken.user) {
            this.user$.next(decodedToken.user);
            return true;
          }
  
          return false;
        })
      );
    } else {
      return of(false);
    }
  }

  logout() {
    this.user$.next(null);
    localStorage.removeItem('token')
    this.router.navigateByUrl('/auth');
  }
}
