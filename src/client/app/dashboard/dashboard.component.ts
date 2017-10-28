import { Component, OnInit } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap';
import { AuthService } from './../shared/services/auth/auth.service';

/**
 * This class represents the lazy loaded DashboardComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  public sidebarOpen = false;

  constructor(private authService:AuthService) {} /*tslint:disable-line*/

  /*
   * Get the names OnInit
   */
  ngOnInit() {
    //let authChecker = this.authService.getHeaders();
  }
  openNav() {
    this.sidebarOpen = true;
  }
  closeNav() {
    this.sidebarOpen = false;
  }

}
