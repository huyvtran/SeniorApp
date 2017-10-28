import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabViewModule } from 'primeng/primeng';
import { AdministrationService } from '../../administration.service';
import { EnrollmentsValidatorComponent } from '../enrollments-validator';
import { EnrollmentsValidationService } from '../enrollments-validation.service';
@Component({
    moduleId: module.id,
    selector: 'sd-enroll-search',
    templateUrl: 'enrollsearch.component.html',
    styleUrls: ['enrollsearch.component.css'],
})
export class EnrollmentsSearchComponent implements OnInit, AfterViewInit {
    public formValidationError: string = '';
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public enrollSearchList: any = [];
    public showForm: boolean = false;
    public showResult: boolean = false;
    public enrollSearchForm: any;
    public noSearchResult: string = '';
    public userNameError: string = '';
    public userACNError: string = '';
    public confirmationNo: string = '';
    public confirmationError: string = '';
    public trackingId: string = '';
    public trackingIdError: string = '';
    public hicn: string = '';
    public hicnError: string = '';
    public paginateMessage: string = '';
    public userACN: string = '';
    public userNameObj: any = {
        firstName: '',
        lastName: ''
    };
    public activeTabIndex: Number = 0;
    public tabIndexCollection: any = {
        'NAME': 0,
        'ACN': 1,
        'CONFIRMATIONNO': 2,
        'TRACKINGID': 3,
        'HCID': 4
    };
    public enrollSearchByNameForm: any;
    public enrollSearchByACNForm: any;
    public enrollSearchByConfirmationNoForm: any;
    public enrollSearchByTrackingIdForm: any;
    public enrollSearchByHICNForm: any;
    public timer: any;

    @Output() searchNotify: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor function
     * @param formBuilder
     * @param
     * @param
     */
    constructor(private formBuilder: FormBuilder, public administrationService: AdministrationService) {

    }
    ngOnInit() {
        this.manageBackButtonDataRetain();
        this.resetAllFormBuilders();
    }
    ngAfterViewInit() {
        this.enrollSearchByNameForm.controls['firstName'].markAsUntouched();
        this.enrollSearchByNameForm.controls['firstName'].updateValueAndValidity();
        this.enrollSearchByNameForm.controls['lastName'].markAsUntouched();
        this.enrollSearchByNameForm.controls['lastName'].updateValueAndValidity();
    }// tslint:disable-line
    manageBackButtonDataRetain() {
        try {
            let retainedInfo: any = JSON.parse(sessionStorage.getItem('administrationEnrollResulsRetain'));
            if (retainedInfo.isFromBack === true && retainedInfo.searchType === 'search') {
                this.retainActiveTab(retainedInfo);
                this.retainSearchCriteria(retainedInfo);
                this.serviceInvoke(retainedInfo.searchedCriteria);
            }
        } catch (e) { } // tslint:disable-line
    }
    /**
     * To retain active tab
     */
    public retainActiveTab(retainedInfo: any) {
        this.activeTabIndex = this.tabIndexCollection[retainedInfo.searchedCriteria.appSearchCriteriaBean.searchBy];
    }

    /**
     * To retain the search inputs
     */
    public retainSearchCriteria(retainedInfo: any) {
        switch (this.activeTabIndex) {
            case 0:
                this.userNameObj.firstName = retainedInfo.searchedCriteria.appSearchCriteriaBean.firstName;
                this.userNameObj.lastName = retainedInfo.searchedCriteria.appSearchCriteriaBean.lastName;
                break;
            case 1:
                this.userACN = retainedInfo.searchedCriteria.appSearchCriteriaBean.acn;
                break;
            case 2:
                this.confirmationNo = retainedInfo.searchedCriteria.appSearchCriteriaBean.confirmationNo;
                break;
            case 3:
                this.trackingId = retainedInfo.searchedCriteria.appSearchCriteriaBean.trackingID;
                break;
            case 4:
                this.hicn = retainedInfo.searchedCriteria.appSearchCriteriaBean.medicareClaimNo;
                break;
        }
    }
    public buildEnrollSearchByNameForm() {
        this.enrollSearchByNameForm = this.formBuilder.group({
            'firstName': ['', [EnrollmentsValidationService.fNameValidator, Validators.minLength(2)]],
            'lastName': ['', [EnrollmentsValidationService.lNameValidator, Validators.minLength(2),]],
        });
    }
    public buildEnrollSearchByACNForm() {
        this.enrollSearchByACNForm = this.formBuilder.group({
            'acn': ['', [EnrollmentsValidationService.acnValidator]],
        });
    }
    public buildEnrollSearchByConfirmationNoForm() {
        this.enrollSearchByConfirmationNoForm = this.formBuilder.group({
            'confirmationNo': ['', [EnrollmentsValidationService.confirmationNoValidator]],
        });
    }
    public buildEnrollSearchByTrackingIdForm() {
        this.enrollSearchByTrackingIdForm = this.formBuilder.group({
            'trackingNo': ['', [EnrollmentsValidationService.trackingIdValidator]],
        });
    }
    public buildEnrollSearchByHICNForm() {
        this.enrollSearchByHICNForm = this.formBuilder.group({
            'hicn': ['', [EnrollmentsValidationService.hicnValidator]],
        });
    }
    public resetEnrollSearchByNameForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollSearchByNameForm();
        }, 500);
    }
    public resetEnrollSearchByACNForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollSearchByACNForm();
        }, 500);
    }
    public resetEnrollSearchByConfirmationNoForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollSearchByConfirmationNoForm();
        }, 500);
    }
    public resetEnrollSearchByTrackingIdForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollSearchByTrackingIdForm();
        }, 500);
    }
    public resetEnrollSearchByHICNForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildEnrollSearchByHICNForm();
        }, 500);
    }
    public resetAllFormBuilders() {
        this.buildEnrollSearchByNameForm();
        this.buildEnrollSearchByACNForm();
        this.buildEnrollSearchByConfirmationNoForm();
        this.buildEnrollSearchByTrackingIdForm();
        this.buildEnrollSearchByHICNForm();
    }
    applyMarkAsTouched(selectedForm: any) {
        for (let inner in selectedForm.controls) {
            selectedForm.get(inner).markAsTouched();
            selectedForm.get(inner).updateValueAndValidity();
        }
    }
    /**
     * Search By Name
     */
    public searchReportByName() {
        this.userNameError = '';
        this.applyMarkAsTouched(this.enrollSearchByNameForm);

        if (this.enrollSearchByNameForm.dirty && this.enrollSearchByNameForm.valid) {
            let data = this.serviceData('name');
            this.serviceInvoke(data);
        } else {
            this.enrollSearchList = null;
        }
        return false;
    }

    /**
     * Search by ACN
     */
    public searchReportByACN() {
        this.userACNError = '';

        this.applyMarkAsTouched(this.enrollSearchByACNForm);
        if (this.enrollSearchByACNForm.dirty && this.enrollSearchByACNForm.valid) {
            let data = this.serviceData('acn');
            this.serviceInvoke(data);
        } else {
            this.enrollSearchList = null;
        }
        return false;
    }

    /**
     * Search by Confirmation No
     */
    public searchReportByConfirmationNo() {
        this.confirmationError = '';
        this.applyMarkAsTouched(this.enrollSearchByConfirmationNoForm);

        if (this.enrollSearchByConfirmationNoForm.dirty && this.enrollSearchByConfirmationNoForm.valid) {
            let data = this.serviceData('cnumber');
            this.serviceInvoke(data);
        } else {
            this.enrollSearchList = null;
        }
        return false;
    }

    /**
     * Search by Tracking ID
     */
    public searchReportByTrackingId() {
        this.trackingIdError = '';
        this.applyMarkAsTouched(this.enrollSearchByTrackingIdForm);

        if (this.enrollSearchByTrackingIdForm.dirty && this.enrollSearchByTrackingIdForm.valid) {
            let data = this.serviceData('tid');
            this.serviceInvoke(data);
        } else {
            this.enrollSearchList = null;
        }
        return false;
    }

    /**
     * Search by HICN
     */
    public searchReportByHICN() {
        this.hicnError = '';
        this.applyMarkAsTouched(this.enrollSearchByHICNForm);

        if (this.enrollSearchByHICNForm.dirty && this.enrollSearchByHICNForm.valid) {
            let data = this.serviceData('hicn');
            this.serviceInvoke(data);
        } else {
            this.enrollSearchList = null;
        }
        return false;
    }

    /**
     * Web service invoke
     */
    public serviceInvoke(postData: object) {
        let enrollment: any = {};
        enrollment['enrollSearchList'] = ['init'];
        this.searchNotify.emit(enrollment);

        this.administrationService.enrollmentSearchReportService(postData).subscribe((data: any) => {
            this.showResult = true;
            this.enrollSearchList = data.appReportLineItem;
            let enrollment: any = {};
            enrollment['enrollSearchList'] = this.enrollSearchList ? this.enrollSearchList : [];
            enrollment['searchedCriteria'] = postData;
            this.searchNotify.emit(enrollment);
        }, (error: any) => { console.log('error : ' + error); });
    }

    /**
     *service post data creation
     */
    public serviceData(type: string) {
        let data: any = '';

        switch (type) {
            case 'name': data = {
                'appSearchCriteriaBean': {
                    'firstName': this.userNameObj.firstName,
                    'lastName': this.userNameObj.lastName,
                    'searchBy': 'NAME'
                }
            };
                break;
            case 'acn': data = {
                'appSearchCriteriaBean': {
                    'acn': this.userACN,
                    'searchBy': 'ACN'
                }
            };
                break;
            case 'cnumber': data = {
                'appSearchCriteriaBean': {
                    'confirmationNo': this.confirmationNo,
                    'searchBy': 'CONFIRMATIONNO'
                }
            };
                break;
            case 'tid': data = {
                'appSearchCriteriaBean': {
                    'trackingID': this.trackingId,
                    'searchBy': 'TRACKINGID'
                }
            };
                break;
            case 'hicn': data = {
                'appSearchCriteriaBean': {
                    'medicareClaimNo': this.hicn,
                    'searchBy': 'HCID'
                }
            };
                break;
        }

        return data;
    }

    /**
     * Remvoe White space from input field
     */
    public trimWhiteSpace() {
        this.userNameObj.firstName = this.userNameObj.firstName ? this.userNameObj.firstName.trim() : '';
        this.userNameObj.lastName = this.userNameObj.lastName ? this.userNameObj.lastName.trim() : '';
        this.userACN = this.userACN ? this.userACN.trim() : '';
        this.confirmationNo = this.confirmationNo ? this.confirmationNo.trim() : '';
        this.trackingId = this.trackingId ? this.trackingId.trim() : '';
        this.hicn = this.hicn ? this.hicn.trim() : '';
    }

    /**
     * Form field validation
     */
    public validator(searchType = 'byName') {
        let message: string = '';
        if (searchType === 'byName') {

            if (this.userNameObj.firstName && this.userNameObj.lastName) {
                message = '';

                if (this.userNameObj.firstName.length < 2 || this.userNameObj.lastName.length < 2) {
                    message = 'Please enter at least 2 characters';
                }
            } else if (!this.userNameObj.firstName && !this.userNameObj.lastName) {
                message = 'Please enter First Name and Last Name';
            } else {

                if (!this.userNameObj.firstName) {
                    message = 'You must complete all required fields to continue. Please enter First Name';
                } else {
                    message = 'You must complete all required fields to continue. Please enter Last Name';
                }
            }
        } else if (searchType === 'byAcn' && this.userACN) {
            message = '';

            if (this.userACN.length !== 8) {
                message = 'ACN must be 8 characters';
            }
            if (!this.userACN.match(/^[0-9a-zA-Z]+$/)) {
                message = 'Please enter a valid ACN';
            }
        } else if (searchType === 'byAcn') {
            message = 'Please enter an ACN';
        } else if (searchType === 'byConfirmationNo' && this.confirmationNo) {
            message = '';

            if (this.confirmationNo.length !== 8) {
                message = 'Confirmation No must be 8 characters';
            }

            if (!this.confirmationNo.match(/^[0-9a-zA-Z]+$/)) {
                message = 'Please enter a valid Confirmation No';
            }
        } else if (searchType === 'byConfirmationNo') {
            message = 'Please enter a Confirmation No';
        } else if (searchType === 'byTrackingId' && this.trackingId) {
            message = '';

            if (!this.trackingId.match(/^[0-9a-zA-Z]+$/)) {
                message = 'Please enter a valid Tracking ID';
            }
        } else if (searchType === 'byTrackingId') {
            message = 'Please enter a Tracking ID';
        } else if (searchType === 'byHicn' && this.hicn) {
            message = '';

            if (!this.hicn.match(/^[0-9a-zA-Z]+$/)) {
                message = 'Please enter a valid HICN';
            }
        } else if (searchType === 'byHicn') {
            message = 'Please enter a HICN';
        }
        return message;
    }

    /**
     * Check name length for atleast 2 character
     * @param value: string
     */
    public checkNameLen(value: string) {
        if (value && value.length < 2) {
            this.userNameError = 'Please enter at least 2 characters';
        } else if (value && value.length >= 2) {
            this.userNameError = '';
        }
    }


    /**
     * Reset functionality
     */
    public resetResult(event: any) {
        this.userNameError = '';
        this.userACN = '';
        this.userACNError = '';
        this.confirmationNo = '';
        this.confirmationError = '';
        this.trackingId = '';
        this.trackingIdError = '';
        this.hicn = '';
        this.hicnError = '';
        this.userNameObj.firstName = '';
        this.userNameObj.lastName = '';
        this.paginateMessage = '';
        this.showResult = true;
        this.noSearchResult = '';
        this.enrollSearchList = [];
        let enrollment: any = {};
        enrollment['enrollSearchList'] = ['init'];
        this.searchNotify.emit(enrollment);
    }
}
