import { Component, Input, ViewChild, Output, EventEmitter  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { Config } from '../../shared/config/env.config';

@Component({
    moduleId: module.id,
    selector: 'sd-logout',
    templateUrl: 'logout.modal.html',
    styleUrls: ['modal-custom.css']
})

export class LogoutModalComponent {

    @ViewChild('logoutModal') public logoutModal: ModalDirective;
    @Input() title?: string;
    @Output() logOutClickFlag:EventEmitter<boolean> = new EventEmitter();

    constructor(private router:Router) {
        // console.log('view details popup');
    }

    /**
     *
     */
    show() {
        this.logoutModal.show();
        this.logOutClickFlag.emit(true);
    }
    /**
     *
     */
    hide() {
        this.logoutModal.hide();
        this.logOutClickFlag.emit(false);
    }

    /**
     *
     */
    public logout() {
        console.log('logged out');
        localStorage.removeItem('userID');
        localStorage.removeItem('userToken');
        localStorage.removeItem('returnUrl');
        if (Config.ENV !== 'SBX' && Config.ENV !== 'DEVELOP') {
            window.location.href = window.location.origin+'/solsadmin/login.html';
        } else {
            this.router.navigate(['login']);
        }
        this.logOutClickFlag.emit(false);
    }
}
