import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Config } from '../../shared/config/env.config';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'sd-timeout',
    templateUrl: 'timeout.modal.html',
    styleUrls: ['modal-custom.css']
})

export class TimeoutModalComponent {

    @ViewChild('timeoutModal') public timeoutModal: ModalDirective;
    @Input() title?: string;
    @Input() secondsLeft?: number;

    private idleTime = 0;
    private id:any;

    constructor(private router: Router) {
        // console.log('timeout');
    }

    battleInit() {
        this.idleTime = this.idleTime + 1;
        if (this.idleTime === 2) {
            this.idleTime = 0;
            this.hide();
            this.logout();
        }
    }

    /**
     *
     */
    show() {
        this.timeoutModal.show();
        this.battleInit();
        this.id = setInterval(() => {
            this.battleInit();
            }, 60000);
    }
    /**
     *
     */
    hide() {
        this.timeoutModal.hide();
        if (this.id) {
            clearInterval(this.id);
        }
    }

    extendTimeout() {
        console.log('extend timeout');
    }

    /**
     *
     */
    public logout() {
        console.log('logged out');
        localStorage.removeItem('userID');
        localStorage.removeItem('userToken');
        //localStorage.removeItem('returnUrl');
        if (Config.ENV !== 'SBX' && Config.ENV !== 'DEVELOP') {
            window.location.href = window.location.origin+'/solsadmin/login.html';
        } else {
            this.router.navigate(['login']);
        }
    }
}
