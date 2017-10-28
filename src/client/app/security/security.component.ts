import {
    Component, Input, Output, EventEmitter, OnInit, ViewChild,
    AfterViewInit, Renderer, ElementRef
} from '@angular/core';
import { SecurityService } from './security.service';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import { ViewDetailsModalComponent } from '../shared/modal-template/viewdetails.modal';
import { DatePipe } from '@angular/common';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityValidatorComponent } from './security.validator';
import { SecurityValidationService } from './security.validation.service';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'security-tab',
    templateUrl: 'security.component.html',
    styleUrls: ['security.component.css'],
    providers: [DatePipe]
})
export class SecurityComponent implements OnInit, AfterViewInit {//, AfterViewInit

    @ViewChild('viewDetailsModal') viewDetailsModal: ViewDetailsModalComponent;
    public tabTitle: string = 'Security';
    public userNameError: string = '';
    public emailError: string = '';
    public countMessage: string = '';
    public noUsermessage: string = '';
    public paginateMessage: string = '';
    public userSearchList: any = [];
    public userSearchListTemp: any = [];
    public showForm: boolean = false;
    public userName: string;
    public maxDateDob: Date;
    public defaultDate: Date;
    public userData: any;
    public showResult: boolean = false;
    public todayStyling: string;
    public dateRange: string = '';
    public userObj: any = {
        firstName: '',
        lastName: '',
        email: '',
        dob: ''
    };
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
    public securityForm: any;
    public htmlElementRef: HTMLElement;
    public firstNameInput: any;
    public timer: any;
    public calendarTextBoxMarginBtm = { 'margin-bottom':'0px' };

    /**
     * calendar controls
     */
    constructor(private userSearch: SecurityService, private datePipe: DatePipe,
        private formBuilder: FormBuilder, private renderer: Renderer,
        private elRef: ElementRef) {
            this.calendarTextBoxMarginBtm ['margin-bottom'] = this.isIE() ? '-6px' : '0px';
         }

    /**
     * setting date field values
     */
    ngOnInit() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month - 1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        this.maxDateDob = new Date();
        this.dateRange = '1900:' + year;
        //this.defaultDate = moment('12-31-2005', 'MM-DD-YYYY').toDate();
        // this.maxDateDob = moment('12-31-2005', 'MM-DD-YYYY').toDate();
        this.maxDateDob.setMonth(month);
        this.maxDateDob.setFullYear(year);
        // this.htmlElementRef  = this.elRef.nativeElement;
        this.buildForm();

    }
    public buildForm() {
        this.securityForm = this.formBuilder.group({
            'firstName': ['', [SecurityValidationService.fNameValidator, Validators.minLength(2)]],
            'lastName': ['', [SecurityValidationService.lNameValidator, Validators.minLength(2),]],
            'dateOfBirth': [null, []],
            'email': ['', [SecurityValidationService.emailValidator]],
        }, {
            validator: SecurityValidationService.dobValidator
        });
    }
    ngAfterViewInit() {
        //this.firstNameInput = this.htmlElementRef.querySelector('#firstName');
        //   console.log(this.firstNameInput.style );
        // this.firstNameInput.style = {'borderBottomColor':'#777373 !important' };
        // this.firstNameInput.focus();
        this.securityForm.controls['firstName'].markAsUntouched();
        this.securityForm.controls['lastName'].markAsUntouched();
        this.securityForm.controls['dateOfBirth'].markAsUntouched();
        this.securityForm.controls['email'].markAsUntouched();
        this.securityForm.controls['firstName'].updateValueAndValidity();
        this.securityForm.controls['lastName'].updateValueAndValidity();
        this.securityForm.controls['dateOfBirth'].updateValueAndValidity();
        this.securityForm.controls['email'].updateValueAndValidity();


    }

    /**
     * Get a date in a format
     */
    public getDate(): string {
        return this.datePipe.transform(this.userObj.dob, 'MM/dd/yyyy'); //whatever format you need.
    }

    /**
     * serch user form submition and web service call
     */
    public searchUser(): any {

        this.noUsermessage = '';
        this.userSearchList = '';
        // this.trimWhiteSpace();
        this.userObj.dob = this.getDate();
        this.applyMarkAsTouched();
        if (this.securityForm.dirty && this.securityForm.valid) {
            this.getUserSearchResult();
        }
        return false;
    }
    /**
     *  Invoking service, generating display results/no results incluidng pagination messages
     */
    public getUserSearchResult() {
        this.userSearch.getUserList(this.userObj).subscribe((data: any) => {
            this.resetResult();
            this.showForm = !this.showForm;
            this.userSearchList = data.userList;
            if (!this.userSearchList || !this.userSearchList.length) {
                this.noUsermessage = 'No Records found. Please refine your search criteria';
            } else if (this.userSearchList.length > 1) {
                this.countMessage = ': ' + this.userSearchList.length + ' Results Found';
            } else {
                this.countMessage = ': ' + this.userSearchList.length + ' Result Found';
            }
            this.paginateMessage = this.getPaginateMessage();
        }, (error: any) => { console.log('error : ' + error); this.noUsermessage = 'error'; });

    }

    /**
     * Remove White space from input field
     */
    public trimWhiteSpace() {
        this.userObj.firstName = this.userObj.firstName ? this.userObj.firstName.trim() : '';
        this.userObj.lastName = this.userObj.lastName ? this.userObj.lastName.trim() : '';
        this.userObj.email = this.userObj.email ? this.userObj.email.trim() : '';
    }
    /**
     * Pagination page click event & message
     */
    public paginationInfo(event: any) {
        if (this.userSearchListTemp.length !== 0) {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.userSearchListTemp.length) ?
                this.userSearchListTemp.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.userSearchListTemp.length + ' Results';
        } else {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.userSearchList.length) ?
                this.userSearchList.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.userSearchList.length + ' Results';
        }
    }

    /**
     * Pagination message on click
     */
    public getPaginateMessage() {
        let message: string = '';

        if (!this.userSearchList || !this.userSearchList.length) {
            message = '';
        } else if (this.userSearchList.length > 10) {
            message = '1-10' + ' of ' + this.userSearchList.length + ' Results';
        } else if (this.userSearchList.length === 1) {
            message = '1-' + this.userSearchList.length + ' of ' + this.userSearchList.length + ' Result';
        } else {
            message = '1-' + this.userSearchList.length + ' of ' + this.userSearchList.length + ' Results';
        }

        return message;
    }

    /**
     * hide username validation error on change
     */
    public hideMe() {
        this.userNameError = '';
    }

    /**
     * Filter result and change the pagination message
     * @param event
     */
    public filterResult(event: any) {
        if (event.filteredValue) {
            this.userSearchListTemp = event.filteredValue;
            if (event.filteredValue.length > 1) {
                this.countMessage = ': ' + event.filteredValue.length + ' Results Found';
            } else {
                this.countMessage = ': ' + event.filteredValue.length + ' Result Found';
            }
        } else {
            this.userSearchListTemp = [];
        }

        if (!event.filteredValue || !event.filteredValue.length) {
            this.paginateMessage = '';
        } else if (event.filteredValue.length > 10) {
            this.paginateMessage = '1-10' + ' of ' + event.filteredValue.length + ' Results';
        } else if (event.filteredValue.length === 1) {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Result';
        } else {
            this.paginateMessage = '1-' + event.filteredValue.length + ' of ' + event.filteredValue.length + ' Results';
        }
    }

    /* tslint:disable */

    /**
     *
     */
    applyMarkAsTouched() {
        for (let inner in this.securityForm.controls) {
            this.securityForm.get(inner).markAsTouched();
            this.securityForm.get(inner).updateValueAndValidity();
        }
    }

    /**
     *
     */
    

    /**
     * Reset Form
     */
    public resetResult() {
        this.userSearchList = '';
        this.userSearchListTemp = [];
        this.countMessage = '';
        this.noUsermessage = '';
    }

    /**
     *
     */
    public resetForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            // this.firstNameInput.focus();
            //this.firstNameInput.style= {'borderBottomColor':'#777373 !important', 'color': 'green' };
            this.userObj.firstName = '';
            this.userObj.lastName = '';
            this.userObj.email = '';
            this.userObj.dob = '';
            this.buildForm();
            // this.resetSecurityFormBuilder();
        }, 500);

    }
    public isIE() {
        let ua = window.navigator.userAgent;
        if(ua.indexOf('MSIE ') >0 || ua.indexOf('Trident/') >0 || ua.indexOf('Edge/') >0 ) {
        return true;
        }else { return false; }
     }
}
