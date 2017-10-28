import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SecurityService } from '../../security/security.service';

@Component({
    moduleId: module.id,
    selector: 'sd-viewdetails',
    templateUrl: 'viewdetails.modal.html',
    styleUrls: ['modal-custom.css']
})

export class ViewDetailsModalComponent {

    @ViewChild('viewDetailsModal') public viewDetailsModal: ModalDirective;
    @Input() title?: string;
    @Input() detailsData?: any;
    @Input() webGuid: string;
    public tempPassword: string = '';
    public resetScreen: boolean = false;
    public userName: string = '';
    public userNameError: string = '';
    public tempPasswordError: string = '';
    public noUsermessage: string = '';
    public userDataObj: any = {
        webGuid: '',
        userName: '',
        firstName: '',
        lastName: '',
        comments: '',
        brand: '',
        state: '',
        targetURL: '',
        email: ''
    };

    constructor(private userSearch: SecurityService) {
        // console.log('view details popup');
    }

    /**
     * Password reset Service call here
     */
    public resetPassword() {
        this.userDataObj.webGuid = this.webGuid;
        this.userSearch.resetPasswordService(this.userDataObj).subscribe((data: any) => {
            console.log(data.user);
            this.title = 'Reset Information';

            if (data.status === 'Success') {
                this.tempPassword = data.user.password;
            } else {
                this.tempPasswordError = data.status;
            }
        },
            (error: any) => { console.log('error ' + error); });
    }

    /**
     * Enable reset confirmation
     */
    public openResetConfirmation() {
        this.resetScreen = true;
        this.title = 'Reset Password Confirmation';
    }

    /**
     * Clearing the form and exiting
     */
    public saveAndOk() {
        this.tempPassword = '';
        this.resetScreen = false;
        this.title = 'User Details';
        this.viewDetailsModal.hide();
    }

    /**
     *
     */
    show() {
        // Call api to get username
        console.log(this.detailsData);
        console.log(this.detailsData.deletedFlag);
        if (this.detailsData.deletedFlag && this.detailsData.deletedFlag === 'Y') {
            this.userNameError = 'Shopper profiles created prior to 10/1/2017 are not accessible';
        } else {
            this.userDataObj.webGuid = this.webGuid;
            this.userSearch.getUserName(this.userDataObj).subscribe((data: any) => {
                console.log(data);

                if (data.status === 'Success') {
                    this.userName = data.user.userName;
                    if (!this.userName) {
                        this.userNameError = 'We’re sorry, but the selected user is not found in IAM';
                    }
                } else {
                    this.userNameError = 'We’re sorry, but the selected user is not found in IAM';
                }
            },
                (error: any) => { console.log('error : ' + error); this.noUsermessage = 'error'; });
        }


        this.viewDetailsModal.show();
    }
    /**
     *
     */
    hide() {
        this.resetScreen = false;
        this.tempPassword = '';
        this.userName = '';
        this.userNameError = '';
        this.tempPasswordError = '';
        this.title = 'User Details';
        this.viewDetailsModal.hide();
    }
}
