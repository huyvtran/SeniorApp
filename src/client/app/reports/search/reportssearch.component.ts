import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TabViewModule, SelectItem } from 'primeng/primeng';
import { ReportsService } from '../reports.service';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import { PaymentHistoryModalComponent } from '../../shared/modal-template/paymenthistory.modal';
import { HelpModalComponent } from '../../shared/modal-template/help.modal';
import { NopdfModalComponent } from '../../shared/modal-template/nopdf.modal';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { ReportsValidatorComponent } from '../reports-validator';
import { ReportsValidationService } from '../reports-validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from '../../shared/config/env.config';
import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'reports-search',
    templateUrl: 'reportssearch.component.html',
    styleUrls: ['reportssearch.component.css'],
})
export class ReportsSearchComponent implements OnInit, AfterViewInit {
    public reportSearchList: any = [];
    public reportSearchListTemp: any = [];
    public currentReportSearchList: any = [];
    public userNameError: string = '';
    public userACNError: string = '';
    public confirmationNo: string = '';
    public confirmationError: string = '';
    public trackingId: string = '';
    public trackingIdError: string = '';
    public hicn: string = '';
    public hicnError: string = '';
    public countMessage: string = '';
    public noSearchResult: string = '';
    public showSearchCriteria: boolean = false;
    public showResult: boolean = false;
    public paginateMessage: string = '';
    public userACN: string = '';
    public API_URL: string = Config.API;
    public downloadData: any = [];
    public userNameObj: any = {
        firstName: '',
        lastName: ''
    };
    public reportSearchByNameForm: any;
    public reportSearchByACNForm: any;
    public reportSearchByConfirmationNoForm: any;
    public reportSearchByTrackingIdForm: any;
    public reportSearchByHICNForm: any;
    public timer: any;
    public responsePdfUrl: string;
    public pdfacn: string = '';

    @ViewChild('paymentHistoryModal') paymentHistoryModal: PaymentHistoryModalComponent;
    @ViewChild('helpModal') helpModal: HelpModalComponent;
    @ViewChild('noPdfModal') noPdfModal: NopdfModalComponent;

    /**
     * Constructor function
     * @param reportService
     */
    constructor(public reportService: ReportsService,
        private formBuilder: FormBuilder,
        private http: Http,
        public downloadCSV: DownloadCSVService) {
    }
    ngOnInit() {
        this.resetAllFormBuilders();
    }
    ngAfterViewInit() {
        this.reportSearchByNameForm.controls['firstName'].markAsUntouched();
        this.reportSearchByNameForm.controls['firstName'].updateValueAndValidity();
    }
    public getPDFReport(acn: string) {
        this.responsePdfUrl = this.API_URL + 'reports/getPdf?acn=' + acn;
        this.pdfacn = acn;
        this.getPdfService().subscribe((response: any) => {
            if (response.status === 200) {
                window.open(this.API_URL + 'reports/getPdf?acn=' + acn, '_blank');
            } else {
                this.noPdfModal.show();
            }
        },
            (error: any) => {
                console.log('error : ' + error);
                this.noPdfModal.show();
            }
        );
    }
    public getPdfService(): Observable<Response> {
        return this.http.get(this.responsePdfUrl)
            .map(res => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    public buildReportSearchByNameForm() {
        this.reportSearchByNameForm = this.formBuilder.group({
            'firstName': ['', [ReportsValidationService.fNameValidator, Validators.minLength(2)]],
            'lastName': ['', [ReportsValidationService.lNameValidator, Validators.minLength(2),]],
        });
    }
    public buildReportSearchByACNForm() {
        this.reportSearchByACNForm = this.formBuilder.group({
            'acn': ['', [ReportsValidationService.acnValidator]],
        });
    }
    public buildReportSearchByConfirmationNoForm() {
        this.reportSearchByConfirmationNoForm = this.formBuilder.group({
            'confirmationNo': ['', [ReportsValidationService.confirmationNoValidator]],
        });
    }
    public buildReportSearchByTrackingIdForm() {
        this.reportSearchByTrackingIdForm = this.formBuilder.group({
            'trackingNo': ['', [ReportsValidationService.trackingIdValidator]],
        });
    }
    public buildReportSearchByHICNForm() {
        this.reportSearchByHICNForm = this.formBuilder.group({
            'hicn': ['', [ReportsValidationService.hicnValidator]],
        });
    }
    public resetReportSearchByNameForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportSearchByNameForm();
        }, 500);
    }
    public resetReportSearchByACNForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportSearchByACNForm();
        }, 500);
    }
    public resetReportSearchByConfirmationNoForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportSearchByConfirmationNoForm();
        }, 500);
    }
    public resetReportSearchByTrackingIdForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportSearchByTrackingIdForm();
        }, 500);
    }
    public resetReportSearchByHICNForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildReportSearchByHICNForm();
        }, 500);
    }
    public resetAllFormBuilders() {
        this.buildReportSearchByNameForm();
        this.buildReportSearchByACNForm();
        this.buildReportSearchByConfirmationNoForm();
        this.buildReportSearchByTrackingIdForm();
        this.buildReportSearchByHICNForm();
    }
    /**
     * Search By Name
     */
    public searchReportByName() {
        this.userNameError = '';
        this.applyMarkAsTouched(this.reportSearchByNameForm);
        if (this.reportSearchByNameForm.dirty && this.reportSearchByNameForm.valid) {
            let data = this.serviceData('name');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportSearchList = null;
        }
        return false;
    }
    applyMarkAsTouched(selectedForm: any) {
        for (let inner in selectedForm.controls) {
            selectedForm.get(inner).markAsTouched();
            selectedForm.get(inner).updateValueAndValidity();
        }
    }
    /**
     * Search by ACN
     */
    public searchReportByACN() {
        this.userACNError = '';
        this.applyMarkAsTouched(this.reportSearchByACNForm);
        if (this.reportSearchByACNForm.dirty && this.reportSearchByACNForm.valid) {
            let data = this.serviceData('acn');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportSearchList = null;
        }
        return false;
    }

    /**
     * Search by Confirmation No
     */
    public searchReportByConfirmationNo() {
        this.confirmationError = '';
        this.applyMarkAsTouched(this.reportSearchByConfirmationNoForm);
        if (this.reportSearchByConfirmationNoForm.dirty && this.reportSearchByConfirmationNoForm.valid) {
            let data = this.serviceData('cnumber');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportSearchList = null;
        }
        return false;
    }

    /**
     * Search by Tracking ID
     */
    public searchReportByTrackingId() {
        this.trackingIdError = '';
        this.applyMarkAsTouched(this.reportSearchByTrackingIdForm);
        if (this.reportSearchByTrackingIdForm.dirty && this.reportSearchByTrackingIdForm.valid) {
            let data = this.serviceData('tid');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportSearchList = null;
        }
        return false;
    }

    /**
     * Search by HICN
     */
    public searchReportByHICN() {
        this.hicnError = '';
        this.applyMarkAsTouched(this.reportSearchByHICNForm);
        if (this.reportSearchByHICNForm.dirty && this.reportSearchByHICNForm.valid) {
            let data = this.serviceData('hicn');
            this.showSearchCriteria = !this.showSearchCriteria;
            this.serviceInvoke(data);
        } else {
            this.reportSearchList = null;
        }
        return false;
    }

    /**
     * Web service invoke
     */
    public serviceInvoke(postData: object) {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportSearchList = '';
        this.reportService.searchReportService(postData).subscribe((data: any) => {
            this.showResult = true;
            this.reportSearchList = data.appReportLineItem;
            if(this.reportSearchList)
            this.checkReportsData(this.reportSearchList);
            if (!this.reportSearchList || !this.reportSearchList.length) {
                this.noSearchResult = 'No Records found. Please refine your search criteria';
            } else if (this.reportSearchList.length > 1) {
                this.countMessage = ': ' + this.reportSearchList.length + ' Results Found';
            } else {
                this.countMessage = ': ' + this.reportSearchList.length + ' Result Found';
            }
            this.paginateMessage = this.getPaginateMessage();
        },
            (error: any) => { console.log('error : ' + error); this.userNameError = 'error'; });
    }

    /**
     *service data creation
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
     * Pagination page click event & message
     */
    public paginationInfo(event: any) {
        if(this.reportSearchListTemp.length !== 0) {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportSearchListTemp.length)
                ? this.reportSearchListTemp.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportSearchListTemp.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportSearchListTemp);
        } else {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportSearchList.length)
                ? this.reportSearchList.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportSearchList.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportSearchList);
        }
    }

    /**
     * Pagination message on click
     */
    public getPaginateMessage() {
        let message: string = '';

        if (!this.reportSearchList || !this.reportSearchList.length) {
            message = '';
        } else if (this.reportSearchList.length > 10) {
            message = '1-10' + ' of ' + this.reportSearchList.length + ' Results';
        } else if (this.reportSearchList.length === 1) {
            message = '1-' + this.reportSearchList.length + ' of ' + this.reportSearchList.length + ' Result';
        } else {
            message = '1-' + this.reportSearchList.length + ' of ' + this.reportSearchList.length + ' Results';
        }
        return message;
    }

    /**
     * Checking Reports data length
     * @param data
     */
    public checkReportsData(data: any) {
        if(data) {
            if(data.length > 0 && data.length < 10) {
                this.currentPageInfo(1,data.length,data);
            } else if(data.length > 10) {
                this.currentPageInfo(1,10,data);
            }
        }
        if (!data || !data.length) {
            this.downloadData=[];
        }
    }

    /**
     * Current page user details on datatable
     * @param number1
     * @param number2
     * @param data
     */
    public currentPageInfo(number1: number, number2: number, data: any) {
        let j:number=0;
        this.currentReportSearchList=[];
        for(let i:number = number1-1; i<number2; i++) {
            this.currentReportSearchList[j] = data[i];
            j++;
        }
        this.saveDownloadData();
    }

    /**
     *
     */
    public convertoToDateString(date: any) {
        if (date) {
            let newData = moment(date).format('MM/DD/YYYY HH:mm:ss');
            return newData;
        } else {
            return null;
        }
    }

    /**
     * Current data displayed on table stored to new object array
     */
    public saveDownloadData() {
        this.downloadData = [];
        this.currentReportSearchList.map((item: any) => {
            return {
                ACN: item.acn,
                CONFIRMATION_NO: item.confirmationNo,
                OPT_IN: item.electronicOptIn,
                APP_STATUS: item.applicationStatus,
                APP_SUB_STATUS: item.appSubStatus,
                VERSION: item.applicationVersion,
                BRAND: item.brand,
                STATE: item.state,
                FIRST_NAME: item.firstName,
                LAST_NAME: item.lastName,
                EMAIL: item.emailAddress,
                EMAIL_OPT_IN: item.electronicOptIn,
                WELCOME_KIT_OPT_IN: item.welcomeKitOptIn,
                ANOC_OPT_IN: item.anocOptIn,
                EVENT_ID: item.campaignId,
                HCID: item.hcid,
                TOBACCO_USAGE: item.tobaccoUsage,
                NEW_TO_MEDICARE: item.newToMedicare,
                REQ_EFF: item.requestEffectiveDate,
                FUT_REQ_EFF: item.futureReqEffDate,
                CREATE_PARTNER: item.createPartnerID,
                SUBMIT_PARTNER: item.submitPartnerID,
                PARENT_PRODUCER: item.parentProducerID,
                APAC_ID: item.apacCallID,
                APP_SOURCE: item.appSource,
                APP_SOURCE_VALUE: item.appSourceValue,
                EB_SOURCE: item.ebSource,
                EB_REPLY: item.ebReply,
                STATUS_REASON: item.statusReason,
                EXPIRATION: item.expirationDate,
                SUBMITTED: this.convertoToDateString(item.submittedTimeStamp),
                CANCELLED:this.convertoToDateString(item.cancelledTimeStamp),
                EMAIL_SENT: this.convertoToDateString(item.emailSentTimeStamp),
                LAST_REMAINDER: this.convertoToDateString(item.lastReminderSentTimeStamp),
                APP_HANDOVER: this.convertoToDateString(item.appHandOverTimeStamp),
                LAST_BATCH: this.convertoToDateString(item.lastBatchTimeStamp),
                ACS_SENT: this.convertoToDateString(item.acsSentTimeStamp),
                MEDISYS_SENT: this.convertoToDateString(item.medisysSentTimeStamp),
                IMAGING_SENT: this.convertoToDateString(item.imagingSentTimeStamp),
                HOV_SENT: this.convertoToDateString(item.hovSentTimeStamp),
                COSMO_SENT: this.convertoToDateString(item.cosmoSentTimeStamp),
                AGNECY: item.agencyName,
                AGNET_TIN: item.agentTIN,
                AGENT_FIRST: item.agentFirstName,
                AGENT_MI: item.agentMiddleInitial,
                AGENT_LAST: item.agentLastName,
                AGENT_STATE_ID: item.agentStateID,
                PARENT_AGENCY: item.parentAgencyName,
                PARENT_AGENT_TIN: item.parentAgentTIN,
                PARENT_AGENT_FIRST: item.parentAgentFirstName,
                PARENT_AGENT_MI: item.parentAgentMI,
                PARENT_AGENT_LAST: item.parentAgentLastName,
                PARENT_AGENT_STATE_ID: item.parentAgentStateID,
                APPLYING_FOR_OTHERS: item.applyForOthers,
                AGENT_ASSISTED: item.agentAssisted,
                AGENT_SUBMITTED: item.agentSubmitted,
                WORKING_WITH_AGENT: item.workingWithAgent,
                HICN: item.medicareClaimNo,
                PRODUCT_ID: item.productId,
                PRODUCT_NAME: item.productDisplayName,
                UPDATED_ID: item.modifiedBy,
                UPDATED: this.convertoToDateString(item.modifiedOn),
                CREATED_ID: item.createdBy,
                CREATED: this.convertoToDateString(item.createdOn),
                DOCUMENT_TYPE: item.documentType,
                DEVICE_TYPE: item.deviceType
            }// tslint:disable-line
        }).forEach((item: any) => this.downloadData.push(item));
        //console.log(JSON.stringify(this.downloadData));
    }

    /**
     * Download current Page details
     */
    public downloadCurrentPage() {
        this.downloadCSV.downloadCurrentData(this.downloadData,'Reports');
    }

    /**
    * Sort result and save current
    * @param event
    */
    public sortResult(event: any) {
        //console.log(event.sortResult);
        //console.log(event.sortResult.length);
    }

    /**
     * Filter result and change the pagination message
     * @param event
     */
    public filterResult(event: any) {
        if (event.filteredValue) {
            this.checkReportsData(event.filteredValue);
            this.reportSearchListTemp = event.filteredValue;
            if (event.filteredValue.length > 1) {
                this.countMessage = ': ' + event.filteredValue.length + ' Results Found';
            } else {
                this.countMessage = ': ' + event.filteredValue.length + ' Result Found';
            }
        } else {
            this.reportSearchListTemp = [];
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

    /**
     * Reset functionality
     */
    public resetResult() {
        this.countMessage = '';
        this.reportSearchList = null;
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
        this.countMessage = '';
        this.reportSearchList = null;
        this.reportSearchListTemp = [];
    }
}
