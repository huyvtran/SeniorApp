import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Calendar, SelectItem } from 'primeng/primeng';
import { ReportsService } from '../reports.service';
import { ReportsConfig } from '../api/reportsconfig';
import { ModalDirective, ModalModule } from 'ngx-bootstrap';
import * as moment from 'moment';
import { PaymentHistoryModalComponent } from '../../shared/modal-template/paymenthistory.modal';
import { HelpModalComponent } from '../../shared/modal-template/help.modal';
import { NopdfModalComponent } from '../../shared/modal-template/nopdf.modal';
import { DownloadCSVService } from '../../shared/services/downloadcsv/downloadcsv.service';
import { ReportsValidatorComponent } from '../reports-validator';
import { ReportsCalendarValidatorComponent } from '../reports-calendar-validator';
import { ReportsValidationService } from '../reports-validation.service';
import { Config } from '../../shared/config/env.config';
import { Http, Headers, Response, Jsonp, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'reports-adv-search',
    templateUrl: 'reportsadvsearch.component.html',
    styleUrls: ['reportsadvsearch.component.css'],
})
export class ReportsAdvSearchComponent implements OnInit {
    public reportDateValidationError: string = '';
    public countMessage: string = '';
    public noResultsMessage: string = '';
    public reportAdvanceSearchList: any = [];
    public reportAdvanceSearchListTemp: any = [];
    public currentReportAdvanceSearchList: any = [];
    public showForm: boolean = false;
    public openMore: string = 'block';
    public closeMore: string = 'none';
    public showResult: boolean = false;
    public advanceForm: any;

    public appStatusList: SelectItem[];
    public backEndList: SelectItem[];
    public appFieldsList: SelectItem[];
    public backEndStatusList: SelectItem[];
    public appSourceList: SelectItem[];
    public appTypeList: SelectItem[];
    public approvalStatusList: SelectItem[];
    public createPartnerList: SelectItem[];
    public submitPartnerList: SelectItem[];
    public stateList: SelectItem[];
    public deviceTypeList: SelectItem[];
    public brandList: SelectItem[];

    public selectedAppStatus: any[] = [];
    public downloadData: any = [];
    public selectedBackEnd: string = '';
    public selectedAppField: string = '';
    public selectedBackEndStatus: string = '';
    public selectedAppSource: string = '';
    public selectedAppType: string = '';
    public selectedApprovalStatus: string = '';
    public selectedCreatePartners: any[] = [];
    public selectedsubmitPartners: any[] = [];
    public selectedState: string = '';
    public selectedDeviceType: string = '';
    public selectedBrand: string = '';

    public noSearchResult: string = '';
    public paginateMessage: string = '';
    public fromDate: Date;
    public toDate: Date;
    public fromReqEffDate: Date;
    public toReqEffDate: Date;
    public maxFromDate: Date;
    public maxToDate: Date;
    public maxFromReqEffDate: Date;
    public maxToReqEffDate: Date;
    public timer: any;
    public API_URL: string = Config.API;
    public calendarTextBoxMarginBtm = { 'margin-bottom':'0px' };
    public responsePdfUrl: string;
    public pdfacn: string = '';

    @ViewChild('paymentHistoryModal') paymentHistoryModal: PaymentHistoryModalComponent;
    @ViewChild('helpModal') helpModal: HelpModalComponent;
    @ViewChild('noPdfModal') noPdfModal: NopdfModalComponent;

    /**
     * Constructor function
     * @param formBuilder
     * @param reportService
     * @param reportConfig
     */
    constructor(private formBuilder: FormBuilder,
        public reportService: ReportsService,
        public downloadCSV: DownloadCSVService,
        private http: Http,
        public reportConfig: ReportsConfig) {
        //this.calendarTextBoxMarginBtm ['margin-bottom'] = this.isIE() ? '0px' : '0px';
    }

    /**
     *
     */
    ngOnInit() {
        this.buildAdvanceForm();
        this.initForm();
    }
    buildAdvanceForm() {
        this.advanceForm = this.formBuilder.group({
            fromDate: ['', []],
            toDate: ['', []],
            fromReqEffDate: ['', []],
            toReqEffDate: ['', []],
            appStatus: [null, ''],
            createPartners: [null, ''],
            submitPartners: [null, ''],
            backEnd: ['', ''],
            appSource: ['', ''],
            state: ['', ''],
            brand: ['', ''],
            appType: ['', ''],
            deviceType: ['', ''],
            approvalStatus: ['', ''],
            appField: ['', ''],
            backEndStatus: ['', ''],
        }, {
                validator: ReportsValidationService.dateValidator
            });
    }
    public resetAdvanceForm() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.buildAdvanceForm();
        }, 500);
    }
    applyMarkAsTouched() {
        this.advanceForm.get('fromDate').markAsTouched();
        this.advanceForm.get('fromDate').updateValueAndValidity();
        this.advanceForm.get('toDate').markAsTouched();
        this.advanceForm.get('toDate').updateValueAndValidity();
        this.advanceForm.get('fromReqEffDate').markAsTouched();
        this.advanceForm.get('fromReqEffDate').updateValueAndValidity();
        this.advanceForm.get('toReqEffDate').markAsTouched();
        this.advanceForm.get('toReqEffDate').updateValueAndValidity();
    }
    /**
     * Initialization
     */
    initForm() {
        this.initDateFields();
        this.appStatusList = this.reportConfig.initAppStatusList();
        this.backEndStatusList = this.reportConfig.initBackEndStatusList();
        this.createPartnerList = this.reportConfig.initCreatePartnerList();
        this.appSourceList = this.reportConfig.initAppSourceList();
        this.submitPartnerList = this.reportConfig.initSubmitPartnerList();
        this.stateList = this.reportConfig.initStateList();
        this.brandList = this.reportConfig.initBrandList();
        this.appTypeList = this.reportConfig.initApptypeList();
        this.appFieldsList = this.reportConfig.initAppFieldsList();
        this.deviceTypeList = this.reportConfig.initDeviceTypeList();
        this.approvalStatusList = this.reportConfig.initApprovalStatusList();
        this.backEndList = this.reportConfig.initBackEndList();
    }

    /**
     *
     */
    moreButtonEvent() {
        this.openMore = 'none';
        this.closeMore = 'block';
    }

    /**
     * Initialize Date
     */
    initDateFields() {
        this.maxToDate = new Date();
        this.maxFromDate = new Date();
        this.maxToReqEffDate = new Date();
        this.maxFromReqEffDate = new Date();
    }

    /**
     * Search function
     */
    public searchReport() {
        this.noSearchResult = '';
        this.countMessage = '';
        this.reportAdvanceSearchList = '';
        this.applyMarkAsTouched();
        if (this.advanceForm.dirty && this.advanceForm.valid) {
            let postData = this.serviceData();
            this.reportService.searchReportService(postData).subscribe((data: any) => {
                this.showResult = true;
                this.showForm = !this.showForm;
                this.reportAdvanceSearchList = data.appReportLineItem;
                if (this.reportAdvanceSearchList)
                    this.checkReportsData(this.reportAdvanceSearchList);
                if (!this.reportAdvanceSearchList || !this.reportAdvanceSearchList.length) {
                    this.noSearchResult = 'No Records found. Please refine your search criteria';
                } else if (this.reportAdvanceSearchList.length > 1) {
                    this.countMessage = ': ' + this.reportAdvanceSearchList.length + ' Results Found';
                } else {
                    this.countMessage = ': ' + this.reportAdvanceSearchList.length + ' Result Found';
                }
                this.paginateMessage = this.getPaginateMessage();
            },
                (error: any) => { console.log('error : ' + error); this.noSearchResult = 'error'; });
        }
        return false;

    }

    /**
     *service data creation
     */
    public serviceData() {
        let postData = {
            'appSearchCriteriaBean': {
                'fromDateStr': (this.fromDate) ? moment(this.fromDate).format('MM/DD/YYYY') : '',
                'toDateStr': (this.toDate) ? moment(this.toDate).format('MM/DD/YYYY') : '',
                'fromReqEffDateStr': (this.fromReqEffDate) ? moment(this.fromReqEffDate).format('MM/DD/YYYY') : '',
                'toReqEffDateStr': (this.toReqEffDate) ? moment(this.toReqEffDate).format('MM/DD/YYYY') : '',
                'status': (this.selectedAppStatus && this.selectedAppStatus.length === 11) ? [] : this.selectedAppStatus,
                'backEnd': this.selectedBackEnd,
                'appFields': this.selectedAppField,
                'muStatus': this.selectedBackEndStatus,
                'appSource': this.selectedAppSource,
                'appType': this.selectedAppType,
                'approvalStatus': this.selectedApprovalStatus,
                'createPartner': (this.selectedCreatePartners && this.selectedCreatePartners.length === 8) ?
                    ['all'] : this.selectedCreatePartners,
                'submitPartner': (this.selectedsubmitPartners && this.selectedsubmitPartners.length === 7) ?
                    ['all'] : this.selectedsubmitPartners,
                'state': this.selectedState,
                'brand': this.selectedBrand,
                'deviceType': this.selectedDeviceType,
                'searchBy': 'ADVANCED'
            }
        };

        return postData;
    }

    /**
     * Date comparison
     * @param date1
     * @param date2
     */
    public isGreater(date1: Date, date2: Date) {
        return moment(date1).isAfter(date2, 'day');
    }


    /**
     * Pagination page click event & message
     * @param event: any
     */
    public paginationInfo(event: any) {
        if (this.reportAdvanceSearchListTemp.length !== 0) {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportAdvanceSearchListTemp.length)
                ? this.reportAdvanceSearchListTemp.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportAdvanceSearchListTemp.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportAdvanceSearchListTemp);
        } else {
            let number1 = (event.first + event.rows + 1) - event.rows;
            let number2 = ((event.first + event.rows) > this.reportAdvanceSearchList.length)
                ? this.reportAdvanceSearchList.length : event.first + event.rows;
            this.paginateMessage = number1 + '-' + number2 + ' of ' + this.reportAdvanceSearchList.length + ' Results';
            this.currentPageInfo(number1, number2, this.reportAdvanceSearchList);
        }
    }

    /**
     * Pagination message on click
     */
    public getPaginateMessage() {
        let message: string = '';

        if (!this.reportAdvanceSearchList || !this.reportAdvanceSearchList.length) {
            message = '';
        } else if (this.reportAdvanceSearchList.length > 10) {
            message = '1-10' + ' of ' + this.reportAdvanceSearchList.length + ' Results';
        } else if (this.reportAdvanceSearchList.length === 1) {
            message = '1-' + this.reportAdvanceSearchList.length + ' of ' + this.reportAdvanceSearchList.length + ' Result';
        } else {
            message = '1-' + this.reportAdvanceSearchList.length + ' of ' + this.reportAdvanceSearchList.length + ' Results';
        }
        return message;
    }

    /**
    * Checking Reports data length
    * @param data
    */
    public checkReportsData(data: any) {
        if (data) {
            if (data.length > 0 && data.length < 10) {
                this.currentPageInfo(1, data.length, data);
            } else if (data.length > 10) {
                this.currentPageInfo(1, 10, data);
            }
        }
        if (!data || !data.length) {
            this.downloadData = [];
        }
    }

    /**
     * Current page user details on datatable
     * @param number1
     * @param number2
     * @param data
     */
    public currentPageInfo(number1: number, number2: number, data: any) {
        let j: number = 0;
        this.currentReportAdvanceSearchList = [];
        for (let i: number = number1 - 1; i < number2; i++) {
            this.currentReportAdvanceSearchList[j] = data[i];
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
        this.currentReportAdvanceSearchList.map((item: any) => {
            return {
                ACN: item.acn,
                CONFIRMATION_NO: item.confirmationNo,
                OPT_IN: item.electronicOptIn,
                VERSION: item.applicationVersion,
                BRAND: item.brand,
                STATE: item.state,
                FIRST_NAME: item.firstName,
                LAST_NAME: item.lastName,
                GENDER: item.sex,
                DOB: item.dob,
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
                CANCELLED: this.convertoToDateString(item.cancelledTimeStamp),
                APP_STATUS: item.applicationStatus,
                APP_SUB_STATUS: item.appSubStatus,
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
        this.downloadCSV.downloadCurrentData(this.downloadData, 'Reports');
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
            this.reportAdvanceSearchListTemp = event.filteredValue;
            this.checkReportsData(event.filteredValue);
            if (event.filteredValue.length > 1) {
                this.countMessage = ': ' + event.filteredValue.length + ' Results Found';
            } else {
                this.countMessage = ': ' + event.filteredValue.length + ' Result Found';
            }
        } else {
            this.reportAdvanceSearchListTemp = [];
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

    /**
     *Reset function
     */
    public resetResult() {
        this.reportAdvanceSearchList = [];
        this.reportAdvanceSearchListTemp = [];
        this.reportDateValidationError = '';
        this.countMessage = '';
        this.showResult = false;
        this.noSearchResult = '';
        this.paginateMessage = '';
        this.selectedAppStatus = [];
        this.selectedBackEnd = '';
        this.selectedAppField = '';
        this.selectedBackEndStatus = '';
        this.selectedAppSource = '';
        this.selectedAppType = '';
        this.selectedApprovalStatus = '';
        this.selectedCreatePartners = [];
        this.selectedsubmitPartners = [];
        this.selectedState = '';
        this.selectedDeviceType = '';
        this.selectedBrand = '';
        this.initForm();
    }
    public isIE() {
        let ua = window.navigator.userAgent;
        if(ua.indexOf('MSIE ') >0 || ua.indexOf('Trident/') >0 || ua.indexOf('Edge/') >0 ) {
        return true;
        }else { return false; }
     }
}
