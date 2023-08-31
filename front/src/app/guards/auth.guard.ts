import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JWT_TOKEN } from '../utils/constants';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor (
    private authService: AuthService, 
    private router: Router,
    public jwtHelper: JwtHelperService,
    ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      
      const accessToken = localStorage.getItem(JWT_TOKEN);
      const isAuthenticated = !this.jwtHelper.isTokenExpired(accessToken);
      
      if (isAuthenticated)
      {
        this.authService.setAuthenticated(true);
        return true;
      }
      else
      {
        this.authService.setAuthenticated(false);
        return this.router.createUrlTree(['/login']);
      }
        
      return false;
    }
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardReversed implements CanActivate {
  
  constructor (
    private authService: AuthService, 
    private router: Router,
    public jwtHelper: JwtHelperService,
    ) {
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      const accessToken = localStorage.getItem(JWT_TOKEN);
      const isAuthenticated = !this.jwtHelper.isTokenExpired(accessToken);
      
      if (isAuthenticated) {

        this.authService.setAuthenticated(true);
        return this.router.createUrlTree(['/home']);
      }
      
      this.authService.setAuthenticated(false);
      return true;
  }
  
}
