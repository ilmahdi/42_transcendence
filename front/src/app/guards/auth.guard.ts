import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JWT_TOKEN } from '../utils/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GameService } from '../services/game.service';

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

@Injectable({
  providedIn: 'root'
})
export class TwoFaGuard implements CanActivate {
  
  constructor (
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
        return true;
      else
        return this.router.createUrlTree(['/login']);
      
      return false;
        
    }
  
}
@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  
  constructor (
    private router: Router,
    public jwtHelper: JwtHelperService,
    private gameService : GameService,
    ) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      
      const response = await firstValueFrom(this.gameService.isInGameMode$);
        
      if (response)
        return true;
      else
        return this.router.createUrlTree(['/home']);
      
      return false;
    
    }
  
}