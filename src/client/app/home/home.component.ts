import { Component, HostListener, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Config } from '../shared/config/env.config';
import { LogoutModalComponent } from '../shared/modal-template/logout.modal';
import { TimeoutModalComponent } from '../shared/modal-template/timeout.modal';
//import * as jwt from 'angular2-jwt/angular2-jwt';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('logoutModal') logoutModal: LogoutModalComponent;
  @ViewChild('timeoutModal') timeoutModal: TimeoutModalComponent;

  public enableBreadcrumbNav = false;

  public idleTime: number = 0;
  public secondLeft = 60;
  public logOutClick: boolean = false;
  private idleTimeLimit = 15; // minutes
  private id: any;

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.idleTime = 0;
  }

  constructor(protected location: Location, protected route: Router) {
    route.events.subscribe((event) => {
      if (event instanceof NavigationEnd === true) {
        console.log(route.url);
        if (route.url !== '/home' && route.url !== '/home/dashboard') {
          this.enableBreadcrumbNav = true;
        }
      }
    });
  }

  ngOnInit() {
    if (!localStorage.getItem('userID')) {
      if (Config.ENV !== 'SBX' && Config.ENV !== 'DEVELOP') {
        window.location.href = window.location.origin + '/solsadmin/login.html';
      } else {
        this.route.navigate(['login']);
      }
    }
    this.battleInit();
    this.id = setInterval(() => {
      this.battleInit();
    }, 60000);
  }

  battleInit() {
    this.idleTime = this.idleTime + 1;
    localStorage.setItem('returnUrl', this.route.url);
    if (this.idleTime > (this.idleTimeLimit + this.secondLeft / 60)) {
      localStorage.removeItem('userID');
      localStorage.removeItem('userToken');
      if (Config.ENV !== 'SBX' && Config.ENV !== 'DEVELOP') {
        window.location.href = window.location.origin + '/solsadmin/login.html';
      } else {
        this.route.navigate(['login']);
      }
    } else if (this.idleTime > this.idleTimeLimit) {
      this.timeoutModal.show();
    }
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  getLogoutClick(event: any) {
    console.log(event);
    this.logOutClick = event;
  }
}
