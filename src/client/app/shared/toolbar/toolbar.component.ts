import {
  Component, Input, Output, EventEmitter, OnInit, ViewChild,
  AfterViewInit, Renderer, ElementRef, HostListener, OnDestroy
} from '@angular/core';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import { LogoutModalComponent } from '../modal-template/logout.modal';
import { TimeoutModalComponent } from '../modal-template/timeout.modal';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent {

  @ViewChild('logoutModal') logoutModal: LogoutModalComponent;
  @Input() idleTime?: any;
  @Output() modelClick:EventEmitter<boolean> = new EventEmitter();

  public sidebarOpen = false;
  public logOutClick = false;
  public enableHeaderNav = false;
  public userName = localStorage.getItem('userID');

  constructor() {
    // console.log('toolbar');
  }

  openNav() {
    this.sidebarOpen = true;
  }

  closeNav() {
    this.sidebarOpen = false;
  }

  logout() {
    console.log('logout called');
  }

  getLogoutClick(event: any) {
    this.logOutClick = event;
    this.modelClick.emit(event);
  }
}
