// auth-guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './shared/services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authService.checkToken()) {
      return true;
    }

    //get their current page url
    //if(this.router.isActive)
    localStorage.setItem('return',next.routeConfig['path']);
    this.router.navigate(['login']);
    return false;
  }

}

@Injectable()
export class HasAccess implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let access = next.url[0].path;
    let path:string;
    switch(access) {
      case 'about':
          path = '/about';
        break;

        default:
          path = '/login';
        break;
    }

    if(this.authService.hasPermission(path)) {
      return true;
    }else {
      this.router.navigate(['login']);
    }
    return false;
  }

}
